import "./AddPageComponent.css";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Image,
  OverlayTrigger,
  Spinner,
  Toast,
  ToastContainer,
  Tooltip,
} from "react-bootstrap";
import Content from "../models/content";
import { IMG_LIST, imagePath } from "../utils/imageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../API";
import Page from "../models/page";
import { DeleteButton, DownButton, UpButton } from "./ButtonComponent";
import User from "../models/user";
import * as yup from "yup";
import { pageSchema } from "../validations/pageValidation";

const defaultContent = (id) =>
  new Content({
    id: id,
    contentType: "paragraph",
    content: { paragraph: "Paragraph section" },
  });

/**
 *
 * @param {Object} props
 * @param {boolean} props.waiting,
 * @param {boolean} props.error,
 * @param {User[]?} props.users,
 * @param {Page} props.page,
 * @param {React.Dispatch<React.SetStateAction<Page>>} props.setPage,
 * @param {Content[]} props.contents,
 * @param {React.Dispatch<React.SetStateAction<Content[]>>} props.setContents,
 * @param {()} props.handleSubmit,
 * @param {()} props.handleClose,
 * @returns
 */
export default function PageFormComponent({
  waiting,
  error,
  users,
  page,
  setPage,
  contents,
  setContents,
  handleSubmit,
  handleClose,
}) {
  const [headerWarning, setHeaderWarning] = useState(false);
  const [contentWarning, setContentWarning] = useState(false);

  /**
   * @param {import("../models/content").CONTENT_TYPE} type
   * @param {Content} content
   * @returns {boolean}
   */
  const checkPageConditions = (newType, content) => {
    // We cannot have less than one header
    if (content.contentType === "header" && getHeaderCount(contents) === 1) {
      setHeaderWarning(true);
      return false;
    }

    // We cannot have less than another type of block (other than a header)
    if (newType === "header" && contents.length === 2) {
      setContentWarning(true);
      return false;
    }

    return true;
  };

  /**
   * @param {import("../models/content").CONTENT_TYPE} type
   * @param {Content} content
   */
  const setContentType = (type, content) => {
    if (type === content.contentType) return;

    if (!checkPageConditions(type, content)) return;

    setContents((contents) =>
      contents.map((c) => {
        if (content.id === c.id) {
          return c.mapToNewType(type);
        } else {
          return c;
        }
      })
    );
  };

  /** @param {Content} content */
  const deleteContent = (content) => {
    if (!checkPageConditions("header", content)) return;

    setContents((old) => old.filter((c) => c.id !== content.id));
  };

  /** @param {Content} content */
  const moveUp = (content) => {
    setContents((old) => {
      const newC = [...old];
      const index = newC.findIndex((c) => c.id === content.id);

      if (index === -1) return newC;
      if (index === 0) return newC;

      [newC[index - 1], newC[index]] = [newC[index], newC[index - 1]];

      return newC;
    });
  };

  /** @param {Content} content */
  const moveDown = (content) => {
    setContents((old) => {
      const newC = [...old];
      const index = newC.findIndex((c) => c.id === content.id);

      if (index === -1) return newC;
      if (index === newC.length - 1) return newC;

      [newC[index + 1], newC[index]] = [newC[index], newC[index + 1]];

      return newC;
    });
  };

  /**
   * @param {import("../models/content").InnerContent} innerContent
   * @param {Content} content
   */
  /** @global */
  const setInnerContent = (innerContent, content) => {
    setContents((old) =>
      old.map((c) =>
        content.id === c.id ? new Content({ ...c, content: innerContent }) : c
      )
    );
  };

  const addContent = () => {
    setContents((c) => {
      const id = c
        .map((c) => c.id)
        .reduce((pre, curr) => (curr > pre ? curr : pre), 0);
      return [...c, defaultContent(id + 1)];
    });
  };

  const [validated, setValidated] = useState(false);

  /**
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleFormSubmit = (event) => {
    event.preventDefault();

    pageSchema
      .validate({ ...page, contents })
      .then((v) => {
        handleSubmit(event);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.path);
        console.log(err.message);
        console.log(err.errors);
      })
      .finally(() => {
        setValidated(true);
      });
  };

  return (
    <>
      {waiting ? (
        <Alert variant="secondary">Wating for server response...</Alert>
      ) : null}
      {error ? (
        <Alert variant="danger">The server could not handle the request.</Alert>
      ) : null}
      {/* Toast to show error messagges */}
      <ToastContainer
        className="p-3"
        position="bottom-center"
        style={{ zIndex: 1 }}
      >
        <Toast
          bg="danger"
          show={headerWarning}
          onClose={() => setHeaderWarning(false)}
        >
          <Toast.Header>
            <strong className="me-auto">
              One header must always be present!
            </strong>
          </Toast.Header>
        </Toast>
        <Toast
          bg="danger"
          show={contentWarning}
          onClose={() => setContentWarning(false)}
        >
          <Toast.Header>
            <strong className="me-auto">
              At least another content other than header must always be present!
            </strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>

      {/* Actual FORM implementation */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <PageInfoComponent>
          <PageAuthor users={users} page={page} setPage={setPage} />
          <Form.Group>
            <Form.Label>Creation date</Form.Label>
            <Form.Control
              type="date"
              defaultValue={page.creationDate.format("YYYY-MM-DD")}
              disabled
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={page.title}
              onChange={(e) =>
                setPage((old) => new Page({ ...old, title: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Publication date</Form.Label>
            <Form.Control
              type="date"
              value={page.publicationDate?.format("YYYY-MM-DD") ?? ""}
              onChange={(e) =>
                setPage(
                  (old) =>
                    new Page({
                      ...old,
                      publicationDate: !e.target.value
                        ? null
                        : dayjs(e.target.value),
                    })
                )
              }
            />
          </Form.Group>
        </PageInfoComponent>
        <h2>Page contents</h2>
        {contents.map((c, index) => (
          <Form.Group key={c.id}>
            <PageContentComponent>
              <ContentFormItem
                content={c}
                index={index}
                lastIndex={contents.length - 1}
                setContentType={setContentType}
                setInnerContent={setInnerContent}
                deleteContent={deleteContent}
                moveUp={moveUp}
                moveDown={moveDown}
              />
            </PageContentComponent>
          </Form.Group>
        ))}
        <Button onClick={addContent}>Add content</Button>
        <Form.Group className="d-flex justify-content-end page-form-btn-container">
          <Button
            className="btn-warning"
            onClick={handleClose}
            disabled={waiting}
          >
            Cancel
          </Button>
          <Button type="submit" className="btn-primary" disabled={waiting}>
            Submit {waiting ? <Spinner size="sm" /> : null}
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {User[]?} props.users,
 * @param {Page} props.page,
 * @param {React.Dispatch<React.SetStateAction<Page>>} props.setPage,
 * @returns
 */
function PageAuthor({ users, page, setPage }) {
  const usersMap = users && new Map(users.map((u) => [u.id, u]));

  return (
    <Form.Group>
      <Form.Label>Author</Form.Label>
      {!users ? (
        <Form.Control
          type="text"
          defaultValue={page.author}
          disabled
          required
        />
      ) : (
        <Form.Select
          value={page.userId}
          onChange={(e) =>
            setPage((old) => {
              const userId = Number(e.target.value);

              return new Page({
                ...old,
                userId,
                author: usersMap.get(userId).name,
              });
            })
          }
          required
        >
          {Array.from(usersMap.entries()).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </Form.Select>
      )}
    </Form.Group>
  );
}

function PageInfoComponent({ children }) {
  return (
    <Card className="page-container">
      <Card.Header>Page info section</Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

function PageContentComponent({ children }) {
  return (
    <Card className="page-container">
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {number} props.index
 * @param {number} props.lastIndex
 * @param {(type:import("../models/content").CONTENT_TYPE, content:Content) => void} props.setContentType
 * @param {(type:import("../models/content").InnerContent, content:Content)} props.setInnerContent
 * @param {(content:Content)} props.deleteContent
 * @param {(content:Content)} props.moveUp
 * @param {(content:Content)} props.moveDown
 */
function ContentFormItem({
  content,
  index,
  lastIndex,
  setContentType,
  setInnerContent,
  deleteContent,
  moveUp,
  moveDown,
}) {
  return (
    <>
      <Form.Label>{`Content N. ${index}`}</Form.Label>
      <DeleteButton onClick={() => deleteContent(content)} />
      {index !== 0 ? <UpButton onClick={() => moveUp(content)} /> : null}
      {index !== lastIndex ? (
        <DownButton onClick={() => moveDown(content)} />
      ) : null}
      <Form.Select
        size="sm"
        className="bg-secondary bg-opacity-10"
        value={content.contentType}
        onChange={(e) => setContentType(e.target.value, content)}
      >
        <option value="header">Header</option>
        <option value="paragraph">Paragraph</option>
        <option value="image">Image</option>
      </Form.Select>
      {chooseContentType(content.contentType)({ content, setInnerContent })}
    </>
  );
}

/**
 * @param {import("../models/content").CONTENT_TYPE} type
 */
const chooseContentType = (type) => {
  switch (type) {
    case "header":
      return ContentFormHeader;
    case "image":
      return ContentFormImage;
    case "paragraph":
      return ContentFormParagraph;
  }
};

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {(type:import("../models/content").InnerContent, content:Content)} props.setInnerContent
 */
function ContentFormHeader({ content, setInnerContent }) {
  return (
    <Form.Control
      type="text"
      value={content.content.header}
      onChange={(e) => setInnerContent({ header: e.target.value }, content)}
      required
    />
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {(type:import("../models/content").InnerContent, content:Content)} props.setInnerContent
 */
function ContentFormParagraph({ content, setInnerContent }) {
  return (
    <Form.Control
      as="textarea"
      value={content.content.paragraph}
      onChange={(e) => setInnerContent({ paragraph: e.target.value }, content)}
      required
    />
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {(type:import("../models/content").InnerContent, content:Content)} props.setInnerContent
 */
function ContentFormImage({ content, setInnerContent }) {
  return (
    <OverlayTrigger
      placement="top-start"
      overlay={
        <Tooltip className="img-tooltip">
          <Image
            className="m-4"
            style={{ maxHeight: "15rem" }}
            src={imagePath(content.content.image)}
            alt={content.content.image}
          />
        </Tooltip>
      }
    >
      <Form.Select
        value={content.content.image}
        onChange={(e) => setInnerContent({ image: e.target.value }, content)}
        required
      >
        {IMG_LIST.map((img) => (
          <option key={img} value={img}>
            {img}
          </option>
        ))}
      </Form.Select>
    </OverlayTrigger>
  );
}

/**
 *
 * @param {Content[]} contents
 * @returns {number}
 */
const getHeaderCount = (contents) => {
  return contents
    .filter((c) => c.contentType === "header")
    .map((c) => 1)
    .reduce((a, b) => a + b, 0);
};

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
import { useNavigate } from "react-router-dom";
import API from "../API";
import Page from "../models/page";
import { DeleteButton, DownButton, UpButton } from "./ButtonComponent";

/** @typedef {} */

const defaultContents = [
  new Content({
    id: 1,
    contentType: "header",
    content: { header: "Header section" },
  }),
  new Content({
    id: 2,
    contentType: "paragraph",
    content: { paragraph: "Paragraph section" },
  }),
  new Content({
    id: 3,
    contentType: "image",
    content: { image: IMG_LIST[0] },
  }),
];

const defaultContent = (id) =>
  new Content({
    id: id,
    contentType: "paragraph",
    content: { paragraph: "Paragraph section" },
  });

export default function AddPageComponent() {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [creationDate, setCreationDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [publicationDate, setPublicationDate] = useState("");
  const [contents, setContents] = useState(defaultContents);
  const [headerWarning, setHeaderWarning] = useState(false);
  const [contentWarning, setContentWarning] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

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
    console.log(type, content);
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

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setWaiting(true);
    setError(false);

    API.createPage(
      Page.deserialize({
        id: 0,
        userId: user.id,
        author: user.name,
        title: title,
        creationDate: creationDate,
        publicationDate: publicationDate,
      }),
      contents
    )
      .then((value) => {
        if (!value) setError(true);
        else handleClose();
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <Container>
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
      {user ? (
        <Form onSubmit={handleSubmit}>
          <PageInfoComponent>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                defaultValue={user.name}
                disabled
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Creation date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={creationDate}
                disabled
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Publication date</Form.Label>
              <Form.Control
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
              />
            </Form.Group>
          </PageInfoComponent>
          <PageContentComponent>
            {contents.map((c, index) => (
              <Form.Group key={c.id}>
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
                <hr />
              </Form.Group>
            ))}
            <Button onClick={addContent}>Add content</Button>
          </PageContentComponent>
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
      ) : (
        <Alert variant="warning">
          You need to be authenticated to access this page.
        </Alert>
      )}
    </Container>
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
      <Card.Header>Page contents section</Card.Header>
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

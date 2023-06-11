import "./AddPageComponent.css";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
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
import { IconDelete, IconDownArrow, IconUpArrow } from "../assets/icons";

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
    content: { paragraph: "Header section" },
  }),
  new Content({
    id: 3,
    contentType: "image",
    content: { image: IMG_LIST[0] },
  }),
];

const defaultContent = new Content({
  id: 2,
  contentType: "paragraph",
  content: { paragraph: "Header section" },
});

export default function AddPageComponent() {
  const [title, setTitle] = useState("");
  const [creationDate, setCreationDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [publicationDate, setPublicationDate] = useState("");
  const [contents, setContents] = useState(defaultContents);
  const [headerWarning, setHeaderWarning] = useState(false);
  const [contentWarning, setContentWarning] = useState(false);

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
    setContents((c) => [...c, defaultContent]);
  };

  return (
    <Container>
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
        <Form>
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
                required
              />
            </Form.Group>
          </PageInfoComponent>
          <PageContentComponent>
            {contents.map((c, index) => (
              <Form.Group key={c.id}>
                <ContentFormItem
                  content={c}
                  index={index}
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
        </Form>
      ) : (
        <Spinner />
      )}
    </Container>
  );
}

function PageInfoComponent({ children }) {
  return (
    <Card className="page-container">
      <Card.Header>Page info section</Card.Header>
      <Card.Body>
        <Card.Text>{children}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function PageContentComponent({ children }) {
  return (
    <Card className="page-container">
      <Card.Header>Page contents section</Card.Header>
      <Card.Body>
        <Card.Text>{children}</Card.Text>
      </Card.Body>
    </Card>
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {number} props.index
 * @param {(type:import("../models/content").CONTENT_TYPE, content:Content) => void} props.setContentType
 * @param {(type:import("../models/content").InnerContent, content:Content)} props.setInnerContent
 * @param {(content:Content)} props.deleteContent
 * @param {(content:Content)} props.moveUp
 * @param {(content:Content)} props.moveDown
 */
function ContentFormItem({
  content,
  index,
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
      <UpButton onClick={() => moveUp(content)} />
      <DownButton onClick={() => moveDown(content)} />
      <Form.Select
        size="sm"
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

function DeleteButton({ onClick }) {
  return (
    <Button variant="outline-danger" onClick={onClick}>
      <IconDelete />
    </Button>
  );
}

function UpButton({ onClick }) {
  return (
    <Button variant="outline-secondary" onClick={onClick}>
      <IconUpArrow />
    </Button>
  );
}

function DownButton({ onClick }) {
  return (
    <Button variant="outline-secondary" onClick={onClick}>
      <IconDownArrow />
    </Button>
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

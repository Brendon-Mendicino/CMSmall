import "./AddPageComponent.css";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  ButtonGroup,
  Container,
  Dropdown,
  Form,
  FormText,
  Image,
  OverlayTrigger,
  Popover,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import Content from "../models/content";
import { IMG_LIST, imagePath } from "../utils/imageUtils";

/** @typedef {} */

export default function AddPageComponent() {
  const [title, setTile] = useState("");
  const [creationDate, setCreationDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [publicationDate, setPublicationDate] = useState("");
  const [contents, setContents] = useState([
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
  ]);

  const { user } = useAuth();

  /**
   * @param {import("../models/content").CONTENT_TYPE} type
   * @param {Content} content
   */
  const setContentType = (type, content) => {
    console.log(type, content);
    if (type === content.contentType) return;

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

  return (
    <>
      <Container>
        {user ? (
          <Form>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" defaultValue={user.name} disabled />
            </Form.Group>
            <Form.Group>
              <Form.Label>Creation date</Form.Label>
              <Form.Control type="date" defaultValue={creationDate} disabled />
            </Form.Group>
            <Form.Group>
              <Form.Label>Publication date</Form.Label>
              <Form.Control
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
              />
            </Form.Group>
            {contents.map((c) => (
              <Form.Group key={c.id}>
                <ContentFormItem
                  content={c}
                  setContentType={setContentType}
                  setInnerContent={setInnerContent}
                />
              </Form.Group>
            ))}
          </Form>
        ) : (
          <Spinner />
        )}
      </Container>
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @param {(type:import("../models/content").CONTENT_TYPE, content:Content) => void} props.setContentType
 * @param {(type:import("../models/content").InnerContent, content:Content)} props.setInnerContent
 */
function ContentFormItem({ content, setContentType, setInnerContent }) {
  return (
    <>
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
      type="text"
      value={content.content.paragraph}
      onChange={(e) => setInnerContent({ paragraph: e.target.value }, content)}
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

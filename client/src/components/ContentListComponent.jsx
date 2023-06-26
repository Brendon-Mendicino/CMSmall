import { Card, Col, Row } from "react-bootstrap";
import Content from "../models/content";
import { imagePath } from "../utils/imageUtils";

/**
 *
 * @param {Object} props
 * @param {Content[]} props.contents
 * @returns
 */
export function ContentListComponent({ contents }) {
  return (
    <>
      <Row xs={1} md={1} className="g-4">
        {contents.map((c) => (
          <Col key={c.id}>
            <ContentItemComponent content={c} />
          </Col>
        ))}
      </Row>
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @returns
 */
function ContentItemComponent({ content }) {
  return chooseComponent(content.contentType)({ content });
}

/**
 * @param {import("../models/content").CONTENT_TYPE} type
 */
const chooseComponent = (type) => {
  switch (type) {
    case "header":
      return ContentHeaderComponent;
    case "image":
      return ContentImageComponent;
    case "paragraph":
      return ContentParagraphComponent;
  }
};

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @returns
 */
function ContentHeaderComponent({ content }) {
  return (
    <Card>
      <Card.Header>Header</Card.Header>
      <Card.Body>
        <Card.Title>{content.content.header}</Card.Title>
      </Card.Body>
    </Card>
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @returns
 */
function ContentParagraphComponent({ content }) {
  return (
    <Card>
      <Card.Header>Paragraph</Card.Header>
      <Card.Body>
        <Card.Text>{content.content.paragraph}</Card.Text>
      </Card.Body>
    </Card>
  );
}

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @returns
 */
function ContentImageComponent({ content }) {
  return (
    <Card>
      <Card.Header>Image</Card.Header>
      <Card.Img
        variant="bottom"
        src={imagePath(content.content.image)}
        alt={content.content.image}
      />
    </Card>
  );
}

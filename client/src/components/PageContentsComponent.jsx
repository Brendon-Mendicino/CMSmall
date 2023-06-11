import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../API";
import {
  Badge,
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { ContentListComponent } from "./ContentListComponent";
import { useLocation } from "react-router-dom";
import Page from "../models/page";
import PageStateBadge from "./PageStateBadge";

export default function PageContentsComponent({}) {
  const [contents, setContents] = useState([]);
  const { user } = useAuth();
  const location = useLocation();
  const page = Page.deserialize(location.state.page);

  console.log(page);
  useEffect(() => {
    API.getContents(page.id).then((c) => {
      setContents(c);
    });
  }, [user]);

  return (
    <>
      <Container>
        <PageInfoComponent page={page} />
        <ContentListComponent contents={contents} />
      </Container>
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {Page} props.page
 */
function PageInfoComponent({ page }) {
  return (
    <Card>
      <Card.Header>
        Page content info. <PageStateBadge page={page} />
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroupItem>
          Author: <strong>{page.author}</strong>
        </ListGroupItem>
        <ListGroupItem>
          Title: <strong>{page.title}</strong>
        </ListGroupItem>
        <ListGroupItem>
          Creation date:{" "}
          <strong>{page.creationDate.format("YYYY-MM-DD")}</strong>
        </ListGroupItem>
        <ListGroupItem>
          Publication date:{" "}
          <strong>
            {page.publicationDate
              ? page.publicationDate.format("YYYY-MM-DD")
              : "Unpublished"}
          </strong>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
}
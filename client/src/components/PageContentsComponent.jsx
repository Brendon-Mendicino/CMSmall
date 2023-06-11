import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../API";
import {
  Alert,
  Badge,
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { ContentListComponent } from "./ContentListComponent";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../models/page";
import PageStateBadge from "./PageStateBadge";
import DeletePageButton from "./DeletePageButton";

export default function PageContentsComponent({}) {
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(false);
  const [contents, setContents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const page = Page.deserialize(location.state.page);

  console.log(page);
  useEffect(() => {
    setWaiting(true);
    setError(false);

    API.getContents(page.id)
      .then((c) => {
        setContents(c);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setWaiting(false);
      });
  }, [user]);

  return (
    <>
      <Container>
        {waiting ? (
          <Alert variant="secondary">Waiting for server response...</Alert>
        ) : null}
        {error ? (
          <Alert variant="danger">There was an unexpected error.</Alert>
        ) : null}
        <PageInfoComponent page={page} />
        <DeletePageButton page={page} onSuccess={() => navigate(-1)} />
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

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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Page from "../models/page";
import PageStateBadge from "./PageStateBadge";
import DeletePageButton from "./DeletePageButton";
import UpdatePageButton from "./UpdatePageButton";
import Content from "../models/content";

export default function PageContentsComponent({}) {
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(false);
  const [contents, setContents] = useState(/** @type {Content[]} */ ([]));
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.state?.page
    ? Page.deserialize(location.state.page)
    : null;

  const modifyPage = user?.id === page?.userId || user?.role === "admin";

  /* Go back if page is not valid */
  if (!page) return <Navigate to={"/pages"} />;

  useEffect(() => {
    setWaiting(true);
    setError(false);

    API.getContents(page?.id)
      .then((c) => {
        setContents(c);
      })
      .catch((err) => {
        setContents([]);
        setError(true);
      })
      .finally(() => {
        setWaiting(false);
      });
  }, [user]);

  const editPage = () =>
    navigate(`/pages/${page.id}/edit`, {
      state: {
        page: page.serialize(),
        contents: contents.map((c) => c.serialize()),
      },
    });

  return (
    <>
      <Container className="pb-5">
        {waiting ? (
          <Alert variant="secondary">Waiting for server response...</Alert>
        ) : null}
        {error ? (
          <Alert variant="danger">There was an unexpected error.</Alert>
        ) : null}
        <PageInfoComponent
          page={page}
          footer={
            modifyPage ? (
              <>
                <DeletePageButton page={page} onSuccess={() => navigate(-1)} />
                <UpdatePageButton page={page} onClick={editPage} />
              </>
            ) : null
          }
        />
        <h1>Contents</h1>
        <ContentListComponent contents={contents} />
      </Container>
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {Page} props.page
 * @param {React.JSX.Element} props.footer
 */
function PageInfoComponent({ page, footer }) {
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
      {footer ? <Card.Footer>{footer}</Card.Footer> : null}
    </Card>
  );
}

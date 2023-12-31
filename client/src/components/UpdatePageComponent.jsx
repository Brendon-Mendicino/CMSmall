import { Alert, Container } from "react-bootstrap";
import PageFormComponent from "./PageFormComponent";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Content from "../models/content";
import Page from "../models/page";
import { useEffect, useState } from "react";
import API from "../API";
import User from "../models/user";

export default function UpdatePageComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageId = useParams().pageId;

  const statePage = location.state?.page
    ? Page.deserialize(location.state.page)
    : null;
  /** @type {Content[]?} */
  const stateContents = location.state?.contents.map((c) =>
    Content.deserialize(c)
  );

  const [users, setUsers] = useState(/** @type {User[]?} */ (null));
  const [page, setPage] = useState(statePage);
  const [contents, setContents] = useState(stateContents);

  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setWaiting(true);
    setError(false);

    const promises = Promise.all([
      API.getPage(pageId)
        .then((page) => setPage(page))
        .catch((err) => {
          setPage(null);
          return Promise.reject(err);
        }),
      API.getContents(pageId)
        .then((contents) => setContents(contents))
        .catch((err) => {
          setContents(null);
          return Promise.reject(err);
        }),
      user?.role !== "admin"
        ? Promise.resolve()
        : API.getUsers()
            .then((users) => setUsers(users))
            .catch((err) => {
              setUsers(null);
              return Promise.reject(err);
            }),
    ]);

    promises
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setWaiting(false);
      });
  }, [user]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setWaiting(true);
    setError(false);

    API.updatePage(page, contents)
      .then((value) => {
        if (!value) setError(true);
        else handleClose();
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  if (!page || !contents)
    return (
      <Container>
        <Alert variant="danger">An unexpected error accurred.</Alert>
      </Container>
    );

  return (
    <Container>
      <h1>Updating page.</h1>
      <PageFormComponent
        waiting={waiting}
        error={error}
        users={users}
        page={page}
        setPage={setPage}
        contents={contents}
        setContents={setContents}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </Container>
  );
}

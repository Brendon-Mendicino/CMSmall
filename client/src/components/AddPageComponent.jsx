import "./AddPageComponent.css";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Content from "../models/content";
import { IMG_LIST } from "../utils/imageUtils";
import API from "../API";
import Page from "../models/page";
import PageFormComponent from "./PageFormComponent";
import { useNavigate } from "react-router-dom";
import User from "../models/user";

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

export default function AddPageComponent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          You need to be authenticated to access this page.
        </Alert>
      </Container>
    );
  }

  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);

  const [users, setUsers] = useState(/** @type {User[]?} */ (null));
  const [page, setPage] = useState(
    new Page({
      id: 0,
      userId: user.id,
      author: user.name,
      title: "",
      creationDate: dayjs(),
      publicationDate: null,
    })
  );
  const [contents, setContents] = useState(defaultContents);

  useEffect(() => {
    if (user?.role !== "admin") return;
    setWaiting(true);

    API.getUsers()
      .then((value) => {
        setUsers(value);
      })
      .catch((err) => {
        setUsers();
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

    API.createPage(page, contents)
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

import { useEffect, useState } from "react";
import API from "../API";
import Page from "../models/page";
import { Container, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import PageListComponent from "./PageListComponent";

export default function PageComponent(props) {
  const [pages, setPages] = useState([]);
  const { user, setUser } = useAuth();

  useEffect(() => {
    API.getPages().then((p) => {
      setPages(p);
    });
  }, [user]);

  return (
    <>
      <Container>
        <PageListComponent pages={pages} />
      </Container>
    </>
  );
}

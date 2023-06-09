import { useEffect, useState } from "react";
import API from "../API";
import Page from "../models/page";
import { Container, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function PageComponent(props) {
  const [pages, setPages] = useState([]);
  const { user, setUser } = useAuth();

  useEffect(() => {
    API.getPages().then((p) => {
      setPages(p);
    });
  }, []);

  console.log(user);

  return (
    <>
      <Container>
        <p>{user?.name}</p>
        {pages.map((p) => (
          <Row key={p.id}>{JSON.stringify(p)}</Row>
        ))}
      </Container>
    </>
  );
}

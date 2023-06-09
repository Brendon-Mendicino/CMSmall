import { useEffect, useState } from "react";
import API from "../API";
import Page from "../models/page";
import { Row } from "react-bootstrap";

export default function PageComponent(props) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    API.getPages().then((p) => {
      setPages(p);
    });
  }, []);
  return (
    <>
      {pages.map((p) => (
        <Row key={p.id}>{JSON.stringify(p)}</Row>
      ))}
    </>
  );
}

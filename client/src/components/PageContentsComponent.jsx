import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../API";
import { Container, Row } from "react-bootstrap";
import { ContentListComponent } from "./ContentListComponent";
import { useLocation } from "react-router-dom";
import Page from "../models/page";

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
        <ContentListComponent contents={contents} />
      </Container>
    </>
  );
}

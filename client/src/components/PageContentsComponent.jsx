import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../API";
import { Container, Row } from "react-bootstrap";
import { ContentListComponent } from "./ContentListComponent";

export default function PageContentsComponent({}) {
  const [contents, setContents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    API.getContents(1).then((c) => {
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

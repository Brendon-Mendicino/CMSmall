import "./Page404.css";
import { Col, Container, Row } from "react-bootstrap";
import { IconAirplane } from "../assets/icons";

export default function Page404() {
  return (
    <Container style={{ minHeight: "100vh", width: "100vw", paddingTop: "22rem", overflow: "hidden", marginTop: "-11rem"}}>
      <Row sm={1} md={2} className="d-flex">
        <Col>
          <h1>404 Page Not Found!</h1>
          <p>It seems like you lost yourself on the wrong path...</p>
        </Col>
        <Col className="airplane-container">
          <IconAirplane width={50} height={50} />
        </Col>
      </Row>
      <Row style={{ marginTop: "100px", position: "relative" }}>
        <Col className="moving">
          <IconAirplane width={50} height={50} style={{ rotate: "-90deg"}} className="step-rotate" />
        </Col>
      </Row>
    </Container>
  );
}

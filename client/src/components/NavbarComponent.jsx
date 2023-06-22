import {
  Alert,
  Badge,
  Button,
  Container,
  Form,
  Modal,
  Nav,
  NavDropdown,
  Navbar,
  Overlay,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../API";
import { useEffect, useRef, useState } from "react";

export default function NavbarComponent(props) {
  const [webpageName, setWebpageName] = useState("");
  const [show, setShow] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    API.getPageName().then((name) => setWebpageName(name));
  }, [user]);

  const onSuccess = () => {
    API.getPageName().then((name) => setWebpageName(name));
  };

  return (
    <>
      <ModifyTitleModal
        show={show}
        setShow={setShow}
        webpageName={webpageName}
        setWebpageName={setWebpageName}
        onSuccess={onSuccess}
      />
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand as="div">
            <Link to={"/pages"} className="navbar-brand">
              {webpageName}
              {"™"}
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <NavDropdown title="Menu">
                <NavDropdown.Header>Loggedin section</NavDropdown.Header>
                <NavDropdown.Item as={Link} to={"/pages/add"}>
                  New page
                </NavDropdown.Item>
                {user?.role === "admin" ? (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Header>Admin section</NavDropdown.Header>
                    <NavDropdown.Item onClick={() => setShow(true)}>
                      Modify title
                    </NavDropdown.Item>
                  </>
                ) : null}
              </NavDropdown>
            </Nav>
            <div className="d-flex flex-row align-items-center">
              {user ? (
                <span style={{ marginInlineEnd: "1rem" }}>
                  Logged in as <strong>{user.name}</strong>{" "}
                  {user.role === "admin" ? <Badge pill>Admin</Badge> : null}
                </span>
              ) : null}
              {user ? <LogoutButton /> : <LoginButton />}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {boolean} props.show
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setShow
 * @param {string} props.webpageName
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setWebpageName
 * @param {()} props.onSuccess
 * @returns
 */
function ModifyTitleModal({
  show,
  setShow,
  webpageName,
  setWebpageName,
  onSuccess,
}) {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => setShow(false);
  const handleSubmit = (event) => {
    event.preventDefault();

    setWaiting(true);
    setError(false);

    API.setTitle(webpageName)
      .then(() => {
        onSuccess();
        handleClose();
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Set webpage title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {waiting ? (
            <Alert variant="secondary">Waiting for server response.</Alert>
          ) : null}
          {error ? (
            <Alert variant="danger">Un unexpected error accurred.</Alert>
          ) : null}
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={webpageName}
              onChange={(e) => setWebpageName(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={waiting} variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" disabled={waiting}>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function LoginButton({}) {
  return (
    <Link to={"/login"} className="btn btn-secondary">
      Login
    </Link>
  );
}

function LogoutButton() {
  const target = useRef(null);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const { setUser } = useAuth();

  const logout = async () => {
    setWaiting(true);
    setError(false);

    const res = await API.logout();

    setWaiting(false);
    if (res) setUser();
    else setError(true);
  };

  return (
    <>
      <Button
        ref={target}
        onClick={logout}
        className="btn-secondary"
        disabled={waiting}
      >
        Logout
      </Button>
      <Overlay target={target.current} show={error} placement="bottom">
        {(props) => <Tooltip {...props}>Could not logout!</Tooltip>}
      </Overlay>
    </>
  );
}

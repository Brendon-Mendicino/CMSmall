import {
  Button,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Overlay,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../API";
import { useRef, useState } from "react";

export default function NavbarComponent(props) {
  const { user, setUser } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as="div">
          <Link to={"/pages"} className="navbar-brand">
            Navbar Brand
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to={"/pages/add"} className="nav-link">New page</Link>
            <Nav.Link href="#action2">Link</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <div className="d-flex flex-row align-items-center">
            {user ? (
              <span>
                You are logged in as <strong>{user.name}</strong>
              </span>
            ) : null}
            {user ? <LogoutButton /> : <LoginButton />}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
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

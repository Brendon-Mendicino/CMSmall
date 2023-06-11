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
import { useEffect, useRef, useState } from "react";

export default function NavbarComponent(props) {
  const [webpageName, setWebpageName] = useState("");
  const { user, setUser } = useAuth();

  useEffect(() => {
    API.getPageName().then((name) => setWebpageName(name));
  }, [user]);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as="div">
          <Link to={"/pages"} className="navbar-brand">
            {webpageName}
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to={"/pages/add"} className="nav-link">
              New page
            </Link>
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

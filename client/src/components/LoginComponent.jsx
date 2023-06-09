import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Spinner,
} from "react-bootstrap";
import API from "../API";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginComponent(props) {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setWaiting(true);
    setError(false);

    API.login(username, password)
      .then((user) => {
        setUser(user);
        onClose();
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <Container>
      {waiting ? (
        <Alert variant="secondary">Waiting for response from server.</Alert>
      ) : null}
      {error ? (
        <Alert variant="danger">Wrong password or username.</Alert>
      ) : null}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="test@example.com"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="d-flex">
          <Button className="btn-warning" disabled={waiting} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={waiting}>
            Login
            <Spinner hidden={!waiting} size="sm" />
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

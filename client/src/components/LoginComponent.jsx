import { Button, Container, Form, FormGroup } from "react-bootstrap";
import API from "../API";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginComponent(props) {
  const [waiting, setWaiting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    API.login(username, password).then((v) => {
      setUser(v);
      navigate("/pages");
    });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Button>Cancel</Button>
          <Button type="submit">Login</Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

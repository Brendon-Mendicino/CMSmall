import { Button } from "react-bootstrap";
import { IconDelete, IconDownArrow, IconUpArrow } from "../assets/icons";

export function DeleteButton({ onClick }) {
  return (
    <Button variant="outline-danger" onClick={onClick}>
      <IconDelete />
    </Button>
  );
}

export function UpButton({ onClick }) {
  return (
    <Button variant="outline-secondary" onClick={onClick}>
      <IconUpArrow />
    </Button>
  );
}

export function DownButton({ onClick }) {
  return (
    <Button variant="outline-secondary" onClick={onClick}>
      <IconDownArrow />
    </Button>
  );
}

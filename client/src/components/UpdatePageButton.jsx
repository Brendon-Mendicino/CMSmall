import { Button } from "react-bootstrap";
import { IconEdit } from "../assets/icons";
import Page from "../models/page";

/**
 *
 * @param {Object} props
 * @param {Page} props.page
 * @param {()} props.onClick
 */
export default function UpdatePageButton({ page, onClick }) {
  return (
    <Button onClick={onClick} className="btn-success">
      Edit {<IconEdit />}
    </Button>
  );
}

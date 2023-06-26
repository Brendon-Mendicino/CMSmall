import { useState } from "react";
import { IconDelete } from "../assets/icons";
import Page from "../models/page";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import API from "../API";

/**
 *
 * @param {Object} props
 * @param {Page} props.page
 * @param {() => void} props.onSuccess
 * @returns
 */
export default function DeletePageButton({ page, onSuccess }) {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    if (waiting) return;
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    setWaiting(true);
    setError(false);

    const deleted = await API.deletePage(page.id).finally(() =>
      setWaiting(false)
    );

    if (!deleted) return setError(true);

    handleClose();
    onSuccess();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete <IconDelete />
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop={waiting ? "static" : true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete page.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error ? (
            <Alert variant="danger">
              It wasn't possible to delete the page!
            </Alert>
          ) : null}
          Are your really sure you want to delete this page?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={waiting}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={waiting}>
            Delete {waiting ? <Spinner size="sm" /> : null}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

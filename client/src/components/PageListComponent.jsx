import { Card, Col, Row } from "react-bootstrap";
import Page from "../models/page";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageStateBadge from "./PageStateBadge";

/**
 *
 * @param {Object} props
 * @param {Page[]} props.pages
 * @returns
 */
export default function PageListComponent({ pages }) {
  return (
    <Row xs={1} md={2} className="g-4">
      {pages.map((p) => (
        <Col key={p.id}>
          <PageItem page={p} />
        </Col>
      ))}
    </Row>
  );
}

/**
 *
 * @param {Object} props
 * @param {Page} props.page
 * @returns
 */
function PageItem({ page }) {
  const { user } = useAuth();

  return (
    <Card>
      <Card.Header>
        Written by <strong>{page.author}</strong>
      </Card.Header>
      <Card.Body>
        <Card.Title>{page.title}</Card.Title>
        <div className="d-flex justify-content-end">
          <Link to={`/pages/${page.id}/contents`}>Go to page</Link>
        </div>
      </Card.Body>
      <Card.Footer className="text-muted">
        Published on:{" "}
        <strong>
          {page.publicationDate?.format("DD MMM YYYY") ?? "Unpublished"}
        </strong>{" "}
        {user ? <PageStateBadge page={page} /> : null}
      </Card.Footer>
    </Card>
  );
}

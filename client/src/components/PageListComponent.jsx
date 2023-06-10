import { Card, Col, Row } from "react-bootstrap";
import Page from "../models/page";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  return (
    <Card>
      <Card.Header>
        Written by <strong>{page.author}</strong>
      </Card.Header>
      <Card.Body>
        <Card.Title>{page.title}</Card.Title>
        <Card.Text>
          This is a longer card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </Card.Text>
        <div className="d-flex justify-content-end">
          <Link
            to={`/pages/${page.id}/contents`}
            state={{ page: page.serialize() }}
          >
            Go to page
          </Link>
        </div>
      </Card.Body>
      <Card.Footer className="text-muted">
        Published on: {page.publicationDate?.format("DD MMM YYYY")}
      </Card.Footer>
    </Card>
  );
}

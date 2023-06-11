import { Badge } from "react-bootstrap";
import Page from "../models/page";

/**
 *
 * @param {Object} props
 * @param {Page} props.page
 */
export default function PageStateBadge({ page }) {
  return (
    <>
      {page.publicationState === "draft" ? (
        <Badge pill bg="warning">
          Draft
        </Badge>
      ) : null}
      {page.publicationState === "scheduled" ? (
        <Badge pill bg="secondary">
          Scheduled
        </Badge>
      ) : null}
      {page.publicationState === "published" ? (
        <Badge pill bg="primary">
          Published
        </Badge>
      ) : null}
    </>
  );
}

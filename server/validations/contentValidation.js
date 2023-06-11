import ContentModel from "../models/contentModel.js";

/**
 *
 * @param {ContentModel[]} contents
 * @returns {boolean}
 */
export default function (contents) {
  // Content must have at least one header
  if (contents.filter((c) => c.contentType === "header").length < 1)
    return false;

  if (contents.filter((c) => c.contentType !== "header").length < 1)
    return false;

  return true;
}

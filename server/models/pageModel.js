"use strict";

/**
 * @typedef {"draft"|"scheduled"|"published"} PUBLICATION_STATE
 */

export default class PageModel {
  /**
   *
   * @param {number} id
   * @param {number} userId
   * @param {string} title
   * @param {string} author
   * @param {string} creationDate
   * @param {PUBLICATION_STATE} publicationState
   * @param {string?} publicationDate
   */
  constructor(
    id,
    userId,
    title,
    author,
    creationDate,
    publicationState,
    publicationDate
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.author = author;
    this.creationDate = creationDate;
    this.publicationState = publicationState;
    this.publicationDate = publicationDate;
  }
}

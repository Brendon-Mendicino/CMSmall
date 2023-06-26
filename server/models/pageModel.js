"use strict";

export default class PageModel {
  /**
   *
   * @param {Object} page
   * @param {number} page.id
   * @param {number} page.userId
   * @param {string} page.title
   * @param {string} page.author
   * @param {string} page.creationDate
   * @param {string?} page.publicationDate
   */
  constructor({
    id,
    userId,
    title,
    author,
    creationDate,
    publicationDate
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.author = author;
    this.creationDate = creationDate;
    this.publicationDate = publicationDate;
  }
}


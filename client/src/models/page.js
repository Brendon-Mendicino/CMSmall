import dayjs from "dayjs";

/**
 * @typedef {"draft"|"scheduled"|"published"} PUBLICATION_STATE
 */

export default class Page {
  /**
   *
   * @param {Object} page
   * @param {number} page.id
   * @param {number} page.userId
   * @param {string} page.title
   * @param {string} page.author
   * @param {dayjs.Dayjs} page.creationDate
   * @param {PUBLICATION_STATE} page.publicationState
   * @param {dayjs.Dayjs?} page.publicationDate
   */
  constructor({
    id,
    userId,
    title,
    author,
    creationDate,
    publicationState,
    publicationDate,
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.author = author;
    this.creationDate = creationDate;
    this.publicationState = publicationState;
    this.publicationDate = publicationDate;
  }

  serialize() {
    return {
      ...this,
      creationDate: this.creationDate.format("YYYY-MM-DD"),
      publicationDate: this.publicationDate?.format("YYYY-MM-DD"),
    };
  }

  static deserialize(page) {
    return new Page({
      ...page,
      creationDate: dayjs(page.creationDate),
      publicationDate: page.publicationDate
        ? dayjs(page.publicationDate)
        : null,
    });
  }
}

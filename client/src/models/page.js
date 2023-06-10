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

  /**
   * @param {string?} publicationDate
   * @returns {PUBLICATION_STATE}
   */
  static getState(publicationDate) {
    if (!publicationDate) return "draft";

    if (dayjs().isBefore(dayjs(publicationDate))) return "scheduled";

    return "published";
  }

  static deserialize(page) {
    const publicationState =
      page.publicationState ?? Page.getState(page.publicationDate);

    return new Page({
      ...page,
      creationDate: dayjs(page.creationDate),
      publicationState: publicationState,
      publicationDate: page.publicationDate
        ? dayjs(page.publicationDate)
        : null,
    });
  }
}

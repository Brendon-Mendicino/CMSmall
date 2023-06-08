"use strict";

export default class ContentListModel {
  /**
   *
   * @param {number} order
   * @param {number} pageId
   * @param {number} contentId
   */
  constructor(order, pageId, contentId) {
    this.order = order;
    this.pageId = pageId;
    this.contentId = contentId;
  }
}

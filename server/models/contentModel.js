"use strict";

/**
 * @typedef {"header"|"paragraph"|"image"} CONTENT_TYPE
 */

export class ContentParagraph {
  /**
   *
   * @param {string} text
   */
  constructor(text) {
    this.text = text;
  }
}

export class ContentImage {
  /**
   *
   * @param {string} path
   */
  constructor(path) {
    this.path = path;
  }
}

export class ContentHeader {
  /**
   *
   * @param {string} text
   */
  constructor(text) {
    this.text = text;
  }
}

export default class ContentModel {
  /**
   *
   * @param {number} id
   * @param {number} pageId
   * @param {CONTENT_TYPE} contentType
   * @param {ContentHeader|ContentImage|ContentParagraph} content
   */
  constructor(id, contentType, content) {
    this.id = id;
    this.pageId = pageId;
    this.contentType = contentType;
    this.content = content;
  }
}

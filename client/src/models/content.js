"use strict";

/**
 * @typedef {"header"|"paragraph"|"image"} CONTENT_TYPE
 */

export class ContentParagraph {
  /**
   *
   * @param {string} text
   */
  constructor(paragraph) {
    this.paragraph = paragraph;
  }
}

export class ContentImage {
  /**
   *
   * @param {string} image
   */
  constructor(image) {
    this.image = image;
  }
}

export class ContentHeader {
  /**
   *
   * @param {string} header
   */
  constructor(header) {
    this.header = header;
  }
}

export default class Content {
  /**
   *
   * @param {Object} content
   * @param {number} content.id
   * @param {CONTENT_TYPE} content.contentType
   * @param {ContentHeader|ContentImage|ContentParagraph} content.content
   */
  constructor({ id, contentType, content }) {
    this.id = id;
    this.contentType = contentType;
    this.content = content;
  }

  /**
   *
   * @param {Object} content
   * @param {number} content.id
   * @param {CONTENT_TYPE} content.contentType
   * @param {string} content.content
   * @returns {Content}
   */
  static deserialize(content) {
    let inner;
    switch (content.contentType) {
      case "header":
        inner = new ContentHeader(content.content);
        break;
      case "paragraph":
        inner = new ContentParagraph(content.content);
        break;
      case "image":
        inner = new ContentImage(content.content);
        break;
      default:
        throw Error(`Wront contentType: ${content.contentType}`);
    }

    return new Content({ ...content, content: inner });
  }
}

"use strict";

import { IMG_LIST } from "../utils/imageUtils";

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

/** @typedef {ContentHeader|ContentParagraph|ContentImage} InnerContent */

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

  serialize() {
    return {
      ...this,
      content: this.content[this.contentType],
    };
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

  /**
   *
   * @param {CONTENT_TYPE} type
   * @return {Content}
   */
  mapToNewType(type) {
    switch (type) {
      case "header":
        return new Content({
          ...this,
          content: { header: this.content[this.contentType] },
          contentType: type,
        });
      case "paragraph":
        return new Content({
          ...this,
          content: { paragraph: this.content[this.contentType] },
          contentType: type,
        });
      case "image":
        return new Content({
          ...this,
          content: { image: IMG_LIST[0] },
          contentType: type,
        });
    }
  }

  /** @returns {{id:number, contentType:CONTENT_TYPE, content:string}} */
  mapToModel() {
    const ser = this.serialize();
    return {
      ...ser,
    };
  }
}

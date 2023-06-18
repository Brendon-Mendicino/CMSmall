"use strict";

/**
 * @typedef {"header"|"paragraph"|"image"} CONTENT_TYPE
 */

// export class ContentParagraph {
//   /**
//    *
//    * @param {string} text
//    */
//   constructor(text) {
//     this.text = text;
//   }
// }

// export class ContentImage {
//   /**
//    *
//    * @param {string} path
//    */
//   constructor(path) {
//     this.path = path;
//   }
// }

// export class ContentHeader {
//   /**
//    *
//    * @param {string} text
//    */
//   constructor(text) {
//     this.text = text;
//   }
// }

export default class ContentModel {
  /**
   *
   * @param {Object} content
   * @param {number} content.id
   * @param {number} content.pageId
   * @param {CONTENT_TYPE} content.contentType
   * @param {string} content.content
   * @param {number} content.order
   */
  constructor({ id, pageId, contentType, content, order }) {
    this.id = id;
    this.pageId = pageId;
    this.contentType = contentType;
    this.content = content;
    this.order = order;
  }

  /**
   *
   * @returns {{id: number, contentType:CONTENT_TYPE, content:string}}
   */
  mapToSend() {
    return {
      ...this,
      pageId: undefined,
      order: undefined,
    };
  }
}

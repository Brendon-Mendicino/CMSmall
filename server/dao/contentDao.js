"use strict";

import db from "../db/db.js";
import ContentModel from "../models/contentModel.js";

const Content = {};

/**
 *
 * @param {number} pageId
 * @returns {Promise.<ContentModel[]>}
 */
Content.getOrdered = (pageId) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM contents c, page_content pc " +
      "WHERE c.id = pc.contentId AND c.pageId = ? " +
      "GROUP BY c.id ORDER BY pc.'order' ASC;";

    db.all(query, [pageId], (err, rows) => {
      if (err) return reject(err);
      if (!rows) return resolve([]);

      const contents = rows.map((r) => new ContentModel({ ...r }));
      resolve(contents);
    });
  });
};

/**
 *
 * @param {number} pageId
 * @param {ContentModel[]} contents
 */
Content.insert = async (pageId, contents) => {
  const promises = contents.map((content, index) => {
    return (async () => {
      const contentId = await new Promise((resolve, reject) => {
        const queryContent =
          "INSERT INTO contents (pageId, contentType, content) VALUES (?,?,?)";

        db.run(
          queryContent,
          [pageId, content.contentType, content.content],
          function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });

      return new Promise((resolve, reject) => {
        const queryOrder =
          "INSERT INTO page_content ('order', pageId, contentId) VALUES (?,?,?)";

        db.run(queryOrder, [index, pageId, contentId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    })();
  });

  return Promise.all(promises);
};

/**
 *
 * @param {ContentModel[]} contents
 * @returns
 */
Content.update = (contents) => {};

/**
 *
 * @param {ContentModel[]} contents
 * @returns 
 */
Content.exist = (contents) => {
  /** @type {Promise.<boolean>[]} */
  const promises = contents.map(
    (content) =>
      new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*) WHERE id = ? AND pageId = ?";

        db.get(query, [content.id, content.pageId], (err, row) => {
          if (err) reject(err);

          resolve(contents.length === row);
        });
      })
  );

  return Promise.all(promises);
};

export default Content;

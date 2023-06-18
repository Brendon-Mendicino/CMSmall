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
      "SELECT * FROM contents WHERE pageId = ? " +
      "ORDER BY contents.'order' ASC;";

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
 * @returns
 */
Content.insert = (pageId, contents) => {
  const promises = contents.map(
    (content, index) =>
      new Promise((resolve, reject) => {
        const queryOrder =
          "INSERT INTO contents (pageId, contentType, content, 'order') VALUES (?,?,?,?)";

        db.run(
          queryOrder,
          [pageId, content.contentType, content.content, index],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      })
  );

  return Promise.all(promises);
};

/**
 *
 * @param {ContentModel[]} contents
 * @returns
 */
Content.update = (contents) => {
  const promises = contents.map(
    (content, index) =>
      new Promise((resolve, reject) => {
        const query =
          "UPDATE contents SET contentType = ?, content = ?, 'order' = ? WHERE id = ?";

        db.run(
          query,
          [content.contentType, content.content, index, content.id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      })
  );

  return Promise.all(promises);
};

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

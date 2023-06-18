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
      "SELECT * FROM contents WHERE pageId = ? " + "ORDER BY position ASC;";

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
 * @returns {Promise<number>}
 */
Content.getMaxOrder = (pageId) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT MAX(position) AS position FROM contents WHERE pageId = ?";

    db.get(query, [pageId], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.position : 0);
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
        const query = `INSERT INTO contents (pageId, contentType, content, position) VALUES (?,?,?,?);`;

        db.run(
          query,
          [pageId, content.contentType, content.content, index],
          function (err) {
            if (err) {
              return reject(err);
            }
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
Content.updateAll = (contents) => {
  const promises = contents.map(
    (content, index) =>
      new Promise((resolve, reject) => {
        const query =
          "UPDATE contents SET contentType = ?, content = ?, position = ? WHERE id = ?";

        db.run(
          query,
          [content.contentType, content.content, index, content.id],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      })
  );

  return Promise.all(promises);
};

/**
 *
 * @param {number} pageId
 * @param {ContentModel[]} contents
 * @returns
 */
Content.deleteExclude = (pageId, contents) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM contents WHERE pageId = ? AND id NOT IN (${contents
      .map(() => "?")
      .join(",")})`;

    db.run(query, [pageId, ...contents.map((c) => c.id)], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
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
        const query = "SELECT IFNULL(COUNT(*), 0) AS ncontents " +
        "FROM contents WHERE id = ? AND pageId = ?";

        db.get(query, [content.id, content.pageId], (err, row) => {
          if (err) return reject(err);

          resolve(contents.length === row.ncontents);
        });
      })
  );

  return Promise.all(promises);
};

export default Content;

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

export default Content;

import db from "../db/db.js";
import PageModel from "../models/pageModel.js";

const Page = {};

/**
 *
 * @returns {Promise.<PageModel[]>}
 */
Page.getPages = () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT p.id, p.userId, p.title, u.name AS author, p.creationDate, p.publicationDate " +
      "FROM pages p, users u " +
      "WHERE p.userId = u.id";

    db.all(query, (err, rows) => {
      if (err) return reject(err);
      if (!rows) return resolve([]);

      const pages = rows.map((p) => new PageModel(p));
      resolve(pages);
    });
  });
};

/**
 *
 * @param {number} pageId
 * @returns {Promise.<PageModel?>}
 */
Page.get = (pageId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM pages WHERE id = ?";

    db.get(query, [pageId], (err, row) => {
      if (err) return reject();
      if (!row) return resolve(null);

      const page = new PageModel(row);
      resolve(page);
    });
  });
};

/**
 *
 * @param {number} pageId
 * @returns {Promise.<boolean>}
 */
Page.delete = (pageId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM pages WHERE id = ?";

    db.run(query, [pageId], function (err) {
      if (err) return reject(err);

      const found = this.changes !== 0;
      resolve(found);
    });
  });
};

/**
 *
 * @param {PageModel} page
 * @param {Promise.<number>} pageId
 */
Page.insertPage = (page) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO pages (userId, title, creationDate, publicationDate) " +
      "VALUES (?,?,?,?)";

    db.run(
      query,
      [page.userId, page.title, page.creationDate, page.publicationDate],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

/**
 *
 * @param {PageModel[]} pages
 * @returns
 */
Page.exist = (pages) => {
  /** @type {Promise.<boolean>[]} */
  const promises = pages.map(
    (page) =>
      new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*) FROM pages WHERE id = ?, userId = ?";

        db.get(query, [page.id, page.userId], (err, row) => {
          if (err) reject(err);

          console.log(row);
          resolve(pages.length === row);
        });
      })
  );

  return Promise.all(promises);
};

export default Page;

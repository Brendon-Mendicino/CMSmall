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
    const query =
      "SELECT *, users.name as author, pages.id as id FROM pages, users " +
      "WHERE pages.id = ? AND users.id = pages.userId";

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
        const query =
          "SELECT COUNT(*) AS npages FROM pages WHERE id = ?";

        db.get(query, [page.id], (err, row) => {
          if (err) return reject(err);

          resolve(pages.length === row.npages);
        });
      })
  );

  return Promise.all(promises);
};

/**
 *
 * @param {PageModel[]} pages
 * @returns
 */
Page.update = (pages) => {
  /** @type {Promise<boolean>[]} */
  const promises = pages.map(
    (page) =>
      new Promise((resolve, reject) => {
        const query =
          "UPDATE pages SET userId = ?, title = ?, publicationDate = ? WHERE id = ?";

        db.run(
          query,
          [page.userId, page.title, page.publicationDate, page.id],
          function (err) {
            if (err) return reject(err);

            resolve(this.changes === 1);
          }
        );
      })
  );

  return Promise.all(promises);
};

export default Page;

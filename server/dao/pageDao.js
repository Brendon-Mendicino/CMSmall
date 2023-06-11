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
      "SELECT p.id, p.userId, u.name AS author, p.creationDate, p.publicationDate " +
      "FROM pages p, users u " +
      "WHERE p.userId = u.id";

    db.all(query, (err, rows) => {
      if (err) return reject(err);
      if (!rows) return resolve([]);

      console.log(rows);
      const pages = rows.map((p) => new PageModel(p));
      resolve(pages);
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

export default Page;

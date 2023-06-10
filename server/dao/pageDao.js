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

export default Page;

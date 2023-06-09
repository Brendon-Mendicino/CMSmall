import db from "../db/db.js";
import PageModel from "../models/pageModel.js";

const Page = {};

/**
 *
 * @returns {Promise.<PageModel[]>}
 */
Page.getPages = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM pages";

    db.all(query, (err, rows) => {
      if (err) reject(err);

      if (!rows) resolve([]);

      const pages = rows.map((p) => new PageModel(p));
      resolve(pages);
    });
  });
};

export default Page;

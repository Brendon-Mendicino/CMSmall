import db from "../db/db.js";

const Webpage = {};

Webpage.getName = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM webpage";

    db.get(query, (err, row) => {
      if (err) return reject(err);
      if (!row) reject();

      resolve(row.name);
    });
  });
};

Webpage.setName = (name) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE webpage SET name = ? WHERE rowid = 1";

    db.run(query, [name], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export default Webpage;

import db from "../db/db.js";
import UserModel from "../models/userModel.js";

const User = {};

/**
 *
 * @param {string} email
 * @returns {Promise.<UserModel?>}
 */
User.getUser = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";

    db.get(query, [email], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      const user = new UserModel(row);
      resolve(user);
    });
  });
};

/**
 * 
 * @returns {Promise<UserModel[]>}
 */
User.getAll = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users";

    db.all(query, (err, rows) => {
      if (err) return reject(err);
      if (!rows) return resolve([]);

      const users = rows.map((r) => new UserModel({ ...r }));
      resolve(users);
    })
  })
}

/**
 *
 * @param {UserModel} user
 */
User.insert = (user) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO users (email, name, role, hash, salt) VALUES (?,?,?,?,?)";

    db.run(
      query,
      [user.email, user.name, user.role, user.hash, user.salt],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

export default User;

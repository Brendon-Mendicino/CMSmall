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
      if (err) reject(err);
      if (!row) resolve(null);

      const user = new UserModel(row);
      resolve(user);
    });
  });
};

export default User;

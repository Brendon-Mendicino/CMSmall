"use strict";

/**
 * @typedef {"normal"|"admin"} USER_ROLE
 */

export default class UserModel {
  /**
   *
   * @param {Object} user
   * @param {number} user.id
   * @param {string} user.email
   * @param {string} user.username
   * @param {USER_ROLE} user.role
   * @param {string} user.hash
   * @param {string} user.salt
   */
  constructor({ id, email, username, role, hash, salt }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.role = role;
    this.hash = hash;
    this.salt = salt;
  }
}

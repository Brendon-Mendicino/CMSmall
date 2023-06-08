"use strict";

/**
 * @typedef {"normal"|"admin"} USER_ROLE
 */

export default class UserModel {
  /**
   *
   * @param {number} id
   * @param {string} email
   * @param {string} username
   * @param {USER_ROLE} role
   * @param {string} hash
   * @param {string} salt
   */
  constructor(id, email, username, role, hash, salt) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.role = role;
    this.hash = hash;
    this.salt = salt;
  }
}

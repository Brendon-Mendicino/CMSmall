"use strict";

/**
 * @typedef {"normal"|"admin"} USER_ROLE
 */

export default class User {
  /**
   *
   * @param {Object} user
   * @param {number} user.id
   * @param {string} user.email
   * @param {string} user.name
   * @param {USER_ROLE} user.role
   */
  constructor({ id, email, name, role }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }
}

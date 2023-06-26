export default class UserSession {
  /**
   *
   * @param {Object} user
   * @param {number} user.id
   * @param {string} user.email
   * @param {string} user.name
   * @param {import("../models/userModel").USER_ROLE} user.role
   */
  constructor({ id, email, name, role }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }
}

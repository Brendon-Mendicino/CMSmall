"use strict";

import Page from "./models/page";
import User from "./models/user";

const API = {};

const SERVER_URL = "http://localhost:3001/api";

/**
 *
 * @returns {Promise.<Page[]>}
 */
API.getPages = async () => {
  const res = await fetch(`${SERVER_URL}/pages`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  const body = await res.json();

  return body.map((p) => new Page(p));
};

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise.<User>}
 */
API.login = async (username, password) => {
  const res = await fetch(`${SERVER_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const body = await res.json();

  return new User(body);
};

export default API;

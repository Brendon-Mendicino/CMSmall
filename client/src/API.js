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

  if (!res.ok) {
    throw Error("Login failed");
  }

  const body = await res.json();
  return new User(body);
};

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise.<boolean>}
 */
API.logout = async () => {
  const res = await fetch(`${SERVER_URL}/login`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(5000),
  });

  console.log(res.ok);
  return res.ok;
};

export default API;

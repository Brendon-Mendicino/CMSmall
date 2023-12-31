"use strict";

import Content from "./models/content";
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
  return body.map((p) => Page.deserialize(p));
};

/**
 * @param {number} pageId
 * @returns {Promise.<Page>}
 */
API.getPage = async (pageId) => {
  const res = await fetch(`${SERVER_URL}/pages/${pageId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw Error();

  const body = await res.json();
  return Page.deserialize(body);
};

/**
 * @param {Page} page
 * @param {Content[]} contents
 * @return {Promise.<boolean>}
 */
API.createPage = async (page, contents) => {
  const res = await fetch(`${SERVER_URL}/pages`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...page.mapToModel(),
      contents: contents.map((c) => c.mapToModel()),
    }),
  });

  return res.ok;
};

/**
 *
 * @param {Page} page
 * @param {Content[]} contents
 * @returns
 */
API.updatePage = async (page, contents) => {
  console.log(page);
  const res = await fetch(`${SERVER_URL}/pages/${page.id}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...page.mapToModel(),
      contents: contents.map((c) => c.mapToModel()),
    }),
  });

  if (!res.ok) throw Error();

  return true;
};

/**
 * @param {number} pageId
 * @return {Promise.<boolean>}
 */
API.deletePage = async (pageId) => {
  const res = await fetch(`${SERVER_URL}/pages/${pageId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.ok;
};

/**
 *
 * @param {number} pageId
 * @return {Promise.<Content[]>}
 */
API.getContents = async (pageId) => {
  const res = await fetch(`${SERVER_URL}/pages/${pageId}/contents`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw Error("unauthorized");
  }

  const body = await res.json();
  return body.map((c) => Content.deserialize(c));
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
 * @returns {Promise.<User?>}
 */
API.isLoggedIn = async () => {
  const res = await fetch(`${SERVER_URL}/login`, {
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

  return res.ok;
};

/** @returns {string} */
API.getPageName = async () => {
  const res = await fetch(`${SERVER_URL}/webpage/name`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw Error();

  const { name } = await res.json();
  return name;
};

/**
 *
 * @param {string} name
 * @returns {Promise.<boolean>}
 */
API.setPageName = async (name) => {
  const res = await fetch(`${SERVER_URL}/webpage/name`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) return false;

  return true;
};

/**
 *
 * @returns {Promise<User[]>}
 */
API.getUsers = async () => {
  const res = await fetch(`${SERVER_URL}/users`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw Error();

  const body = await res.json();
  return body.map((u) => new User(u));
};

/**
 *
 * @param {string} name
 * @returns {Promise}
 */
API.setTitle = async (name) => {
  const res = await fetch(`${SERVER_URL}/webpage/name`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw Error();

  return;
};

export default API;

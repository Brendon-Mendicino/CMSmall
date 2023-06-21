import * as yup from "yup";
import { Router } from "express";
import Page from "../dao/pageDao.js";
import passport from "passport";
import dayjs from "dayjs";
import Content from "../dao/contentDao.js";
import pageValidation from "../validations/pageValidation.js";
import Webpage from "../dao/webpageDao.js";
import ContentModel from "../models/contentModel.js";
import User from "../dao/userDao.js";
import crypto from "crypto";
import { KEY_LEN, SALT_LEN } from "../constants.js";
import UserModel from "../models/userModel.js";

const router = Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.status(401).json();
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") return next();

  res.status(401).json();
};

router.get("/api/pages", async (req, res) => {
  try {
    let pages = await Page.getPages();

    if (!req.isAuthenticated()) {
      const now = dayjs();
      pages = pages.filter((p) => now.isAfter(dayjs(p.publicationDate)));
    }

    // sort pages by publication date
    pages.sort((a, b) => {
      if (!a.publicationDate) return 1;
      if (!b.publicationDate) return -1;
      return dayjs(b.publicationDate).diff(dayjs(a.publicationDate));
    });

    res.status(200).json(pages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.get("/api/pages/:pageId", async (req, res) => {
  try {
    const pageId = await yup.number().required().validate(req.params.pageId);

    const page = await Page.get(pageId);

    if (!page) return res.status(404).json();

    if (
      !req.isAuthenticated() &&
      !dayjs().isAfter(dayjs(page.publicationDate))
    ) {
      return res.status(401).json();
    }

    res.status(200).json(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/api/pages/:pageId", isAuthenticated, async (req, res) => {
  try {
    const { ok, page, contents } = await pageValidation(req.body);
    if (!ok) {
      return res.status(400).json();
    }

    const pageExist = (await Page.exist([page]))[0];
    if (page.id !== Number(req.params.pageId) || !pageExist) {
      return res.status(404).json({ error: "Page not found" });
    }

    const contentsWithPageId = contents.map(
      (c) =>
        new ContentModel({
          ...c,
          pageId: page.id,
        })
    );

    const contentsStatus = Content.insert(page.id, [
      ...(await Content.exist(contentsWithPageId))
        .map((exist, index) => (!exist ? contents[index] : null))
        .filter((c) => (c ? true : false)),
    ]);

    await contentsStatus;
    await Content.deleteExclude(page.id, contents);

    // Check if user updating other user page
    if (req.user.id !== page.userId && req.user.role !== "admin") {
      return res.status(401).json({ error: "Cannot change other users page" });
    }

    await Page.update([page]);
    await Content.updateAll(contentsWithPageId);

    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.delete("/api/pages/:pageId", isAuthenticated, async (req, res) => {
  try {
    const schema = yup.number().required();
    const pageId = await schema.validate(req.params.pageId);

    const page = await Page.get(pageId);

    // Only admin can delete someone else page
    if (page?.userId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(401).json();
    }

    const deleted = await Page.delete(pageId);
    if (!deleted) {
      return res.status(404).json();
    }

    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.put("/api/pages", isAuthenticated, async (req, res) => {
  try {
    const { ok, page, contents } = await pageValidation(req.body);
    if (!ok) {
      return res.status(400).json({ error: "Invalid page" });
    }

    // Insert the server-handled fields
    page.userId = req.user.id;
    page.creationDate = dayjs().format("YYYY-MM-DD");

    const pageId = await Page.insertPage(page);
    await Content.insert(pageId, contents);

    res.status(201).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.get("/api/pages/:pageId/contents", async (req, res) => {
  try {
    const schema = yup.number().required();
    const pageId = await schema.validate(req.params.pageId);

    const [contents, page] = await Promise.all([
      Content.getOrdered(pageId),
      Page.get(pageId),
    ]);

    if (
      !req.isAuthenticated() &&
      !dayjs().isAfter(dayjs(page.publicationDate))
    ) {
      return res.status(401).json();
    }

    res.status(200).json(contents.map((c) => c.mapToSend()));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/api/login", passport.authenticate("local"), async (req, res) => {
  if (!req.user) return res.status(400).json();

  res.status(201).json({ ...req.user });
});

router.get("/api/login", async (req, res) => {
  if (req.isAuthenticated()) res.status(200).json({ ...req.user });
  else res.status(404).json();
});

router.delete("/api/login", async (req, res) => {
  req.logout((err) => {
    if (err) return res.status(400).json(err);

    return res.status(200).json();
  });
});

router.put("/api/register", async (req, res) => {
  try {
    const schema = yup.object({
      email: yup.string().required(),
      name: yup.string().required(),
      role: yup.string().required(),
      password: yup.string().required(),
    });
    const { email, name, password, role } = await schema.validate(req.body);

    const salt = crypto.randomBytes(SALT_LEN);
    const hash = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, KEY_LEN, async (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey);
      });
    });

    const user = new UserModel({
      email,
      name,
      role,
      hash: hash.toString("hex"),
      salt: salt.toString("hex"),
    });
    await User.insert(user);

    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.get("/api/webpage/name", async (req, res) => {
  try {
    const name = await Webpage.getName();
    res.status(200).json({ name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/api/webpage/name", isAdmin, async (req, res) => {
  try {
    const schema = yup.object({ name: yup.string().required() });
    const name = await schema.validate(req.body);

    await Webpage.setName(name);
    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default router;

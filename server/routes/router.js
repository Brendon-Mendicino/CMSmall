import * as yup from "yup";
import { Router } from "express";
import Page from "../dao/pageDao.js";
import passport from "passport";
import dayjs from "dayjs";
import Content from "../dao/contentDao.js";
import pageValidation from "../validations/pageValidation.js";
import Webpage from "../dao/webpageDao.js";

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
    res.status(500).json({ error: error.message });
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
    const isAuth = req.user ? true : false;

    const contents = await Content.getOrdered(req.params.pageId);

    res.status(200).json(contents.map((c) => c.mapToSend()));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/login", passport.authenticate("local"), async (req, res) => {
  if (!req.user) return res.status(400).json();

  res.status(201).json({ ...req.user });
});

router.get("/api/login", isAuthenticated, async (req, res) => {
  res.status(200).json({ ...req.user });
});

router.delete("/api/login", async (req, res) => {
  req.logout((err) => {
    if (err) return res.status(400).json(err);

    return res.status(200).json();
  });
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
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default router;

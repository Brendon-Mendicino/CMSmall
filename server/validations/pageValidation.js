"use strict";

import ContentModel from "../models/contentModel.js";
import PageModel from "../models/pageModel.js";
import pageSchemaValidation from "./pageSchemaValidation.js";
import contentValidation from "./contentValidation.js";

/**
 *
 * @param {*} page
 * @returns {Promise.<{ok:boolean, page: PageModel, contents: ContentModel[]}>}
 */
export default async function pageValidation(page) {
  const schema = pageSchemaValidation();

  const validated = await schema.validate(page);

  const newPage = new PageModel({ ...validated });
  const contents = validated.contents.map((c) => new ContentModel({ ...c }));

  if (!contentValidation(contents)) {
    return { ok: false, page: null, contents: null };
  }

  return { ok: true, page: newPage, contents };
}

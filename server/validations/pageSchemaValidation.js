"use strict";

import dayjs from "dayjs";
import * as yup from "yup";

export default function pageSchemaValidation() {
  return yup.object({
    id: yup.number().required(),
    userId: yup.number().required(),
    title: yup.string().required(),
    author: yup.string().required(),
    creationDate: yup
      .string()
      .required()
      .test("iso-date", "${path} is not iso-date string", (value, context) =>
        dayjs(value, "YYYY-MM-DD").isValid()
      ),
    publicationDate: yup
      .string()
      .nullable()
      .test("iso-date", "${path} is not iso-date string", (value, context) =>
        dayjs(value, "YYYY-MM-DD").isValid()
      ),
    contents: yup.array(
      yup.object({
        id: yup.number().required(),
        contentType: yup
          .string()
          .oneOf(["header", "paragraph", "image"])
          .required(),
        content: yup.string().required(),
      })
    ),
  });
}

"use strict";

import dayjs from "dayjs";
import * as yup from "yup";

export const pageSchema = yup.object().shape({
  id: yup.number().required(),
  userId: yup.number().required(),
  author: yup.string().required(),
  title: yup.string().required(),
  creationDate: yup
    .object()
    .required()
    .test("wrong creationDate", "${path}: wrong creationDate", (date) =>
      dayjs(date, "YYYY-MM-DD").isValid()
    ),
  publicationDate: yup
    .object()
    .nullable()
    .test("wrong publicationDate", "${path}: wrong publicationDate", (date) =>
      !date ? true : dayjs(date, "YYYY-MM-DD").isValid()
    ),
  contents: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        contentType: yup
          .string()
          .required()
          .oneOf(["image", "header", "paragraph"]),
        content: yup
          .object()
          .when("contentType", {
            is: "image",
            then: (schema) => schema.shape({ image: yup.string().required() }),
          })
          .when("contentType", {
            is: "header",
            then: (schema) => schema.shape({ header: yup.string().required() }),
          })
          .when("contentType", {
            is: "paragraph",
            then: (schema) =>
              schema.shape({ paragraph: yup.string().required() }),
          })
          .required(),
      })
    )
    .required()
    .test("boh", "boh", (value) => {
      if (!value.some((v) => v.contentType === "header")) return false;
      if (!value.some((v) => v.contentType !== "header")) return false;

      return true;
    }),
});

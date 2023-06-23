"use strict";

import dayjs from "dayjs";
import * as yup from "yup";

export default function pageSchemaValidation() {
  return yup
    .object()
    .shape({
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
          !value ? true : dayjs(value, "YYYY-MM-DD").isValid()
        ),
      contents: yup
        .array()
        .of(
          yup.object().shape({
            id: yup.number().required(),
            contentType: yup
              .string()
              .oneOf(["header", "paragraph", "image"])
              .required(),
            content: yup.string().required(),
          })
        )
        .test(
          "page should have at least  one header and at least another content",
          "page should have at least  one header and at least another content",
          (value) => {
            if (!value.some((v) => v.contentType === "header")) return false;
            if (!value.some((v) => v.contentType !== "header")) return false;
            return true;
          }
        ),
    })
    .required();
}

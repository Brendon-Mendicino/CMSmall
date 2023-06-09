[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8AapHqUJ)
# Exam #N: "Exam Title"
## Student: s317639 MENDICINO BRENDON 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/pages`
  - description: get the list of pages, they are returned ordered by `publicationDate`
  - response body content
  ```json
  [
    {
      "id": 1,
      "title": "Why JS is bad.",
      "author": "Brendon",
      "creationDate": "2020-10-01",
      "publicationState": "published",
      "publicationDate": "2020-10-02"
    },
    ...
  ]
  ```
  - repsonse status
    - `200 OK`
- PUT `/api/pages`
  - description: add a new page
  - request body
  ```json
  {
    "title": "Why JS is bad.",
    "author": "Brendon",
    "creationDate": "2020-10-01",
    "publicationState": "published",
    "publicationDate": "2020-10-02",
    "contents": [
      {
        "contentType": "header",
        "content": "Content text"
      },
      ...
    ]
  }
  ```
  - response status:
    - `200 OK`
    - `400 Bad Request` a page must alway contain at least one header and at least another content
    - `401 Unauthorized` unauthenticated user
    - `500 Internal Server Error`
- DELETE `/api/pages/:pageId`
  - description: delete a page, only the owner of the page or an admin can perform this action
  - response status:
    - `200 OK`
    - `401 Unauthorized` wasn't owner of the page nor an admin
    - `404 Not Found` page not found
    - `500 Internal Server Error`
- POST `/api/pages/:pageId`
  - description: update a page, only the owner of the page or an admin can perform this action
  - request body
  ```json
  {
    "title": "Why JS is bad.",
    "author": "Brendon",
    "creationDate": "2020-10-01",
    "publicationState": "published",
    "publicationDate": "2020-10-02"
  }
  ```
  - response status:
    - `200 OK`
    - `401 Unauthorized` wasn't owner of the page nor an admin
    - `404 Not Found` page not found
    - `500 Internal Server Error`
- GET `/api/pages/:pageId/contents`
  - description: get the ordered list of contents of a page
  - request body: empty
  - response body:
  ```json
  [
    {
      "id": 1,
      "contentType": "header",
      "content": "Contains the header text"
    },
    ...
  ]
  ```
  - response status:
    - `200 OK`
    - `404 Not Found` page not found
    - `500 Internal Server Error`
- PUT `/api/pages/:pageId/contents`
  - description: add a new content to a page
  - request body:
  ```json
  {
    "contentType": "header",
    "content": "Contains the header text"
  }
  ```
  - response body: empty
  - response status:
    - `200 OK`
    - `401 Unauthorized` wasn't owner of the page nor an admin
    - `404 Not Found` page not found
    - `500 Internal Server Error`
- POST `/api/pages/:pageId/contents/order`
  - description: update the order of a page contets
  - request body: contains on ordered list of `contentId`
  ```json
  [
    3, 1, 2, 5, 4
  ]
  ```
  - response status:
    - `200 OK`
    - `401 Unauthorized` wasn't owner of the page nor an admin
    - `404 Not Found` page or content not found
    - `500 Internal Server Error`
- POST `/api/pages/:pageId/contents/:contentId`
  - description: update a content of a page
  - request body:
  ```json
  {
    "contentType": "header",
    "content": "Contains the header text"
  }
  ```
  - response body: empty
  - response status:
    - `200 OK`
    - `401 Unauthorized` wasn't owner of the page nor an admin
    - `404 Not Found` page not found
    - `500 Internal Server Error`
- DELETE `/api/pages/:pageId/contents/:contentId`
  - descritpion: delete a content from a page
  - request body: empty
  - response body: empty
  - response status:
    - `200 OK`
    - `400 Bad Request` a page must alway contain at least one header and at least another content


## Database Tables

- Table `users` - represent the registred users
  | `id` | `email` | `username` | `role` | `hash` | `salt` |
  |-|-|-|-|-|-|

- Table `pages` - represent the pages created by the users
  | `id` | `userId` | `title` | `author` | `creationDate` | `publicationState` | `publicationDate` |
  |-|-|-|-|-|-|-|

- Table `contents` - represent a single content inside a page
  | `id` | `pageId` | `contentType` | `content` |
  |-|-|-|-|

- Table `page_content` - represent the page ownership of contents and their order
  | `order` | `pageId` | `contentId` |
  |-|-|-|

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

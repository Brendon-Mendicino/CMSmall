[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8AapHqUJ)

# Exam #N: "Exam Title"

## Student: s317639 MENDICINO BRENDON

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/pages`
  - description: get the list of pages, they are returned ordered by `publicationDate`, non-authenticated user will only receive "published" pages
  - response body content
  ```json
  [
    {
      "id": 1,
      "userId": 1,
      "title": "Why JS is bad.",
      "author": "Brendon",
      "creationDate": "2020-10-01",
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
    "id": 1,
    "userId": 1,
    "title": "Why JS is bad.",
    "author": "Brendon",
    "creationDate": "2020-10-01",
    "publicationDate": "2020-10-02",
    "contents": [
      {
        "id": 1,
        "contentType": "header",
        "content": "Content text"
      },
      ...
    ]
  }
  ```
  - repsonse body: empty
  - response status:
    - `201 Created`
    - `400 Bad Request` a page must alway contain at least one header and at least another content
    - `401 Unauthorized` unauthenticated user
    - `500 Internal Server Error`
- DELETE `/api/pages/:pageId`
  - description: delete a page and all his contents, only the owner of the page or an admin can perform this action
  - request body: empty
  - response body: empty
  - response status:
    - `204 OK`
    - `401 Unauthorized` wasn't owner of the page nor an admin
    - `404 Not Found` page not found
    - `500 Internal Server Error`
- GET `/api/pages/:pageId`
  - description: get the list a single page, non-authenticated user will only receive "published" pages
  - request body: empty
  - response body content
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Why JS is bad.",
    "author": "Brendon",
    "creationDate": "2020-10-01",
    "publicationDate": "2020-10-02"
  }
  ```
  - repsonse status
    - `200 OK`
    - `401 Unauthorized` If non-authenticated user tried to access non-"published" page
    - `404 Not Fount` Page not found
    - `500 Internal Server Error`
- POST `/api/pages/:pageId`
  - description: update a page and his contents, only the owner of the page or an admin can perform this action
  - request body
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Why JS is bad.",
    "author": "Brendon",
    "creationDate": "2020-10-01",
    "publicationDate": "2020-10-02",
    "contents": [
      {
        "id": 1,
        "contentType": "header",
        "content": "Content text"
      },
      ...
    ]
  }
  ```
  - response status:
    - `204 OK`
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
<!-- - PUT `/api/pages/:pageId/contents`
  - description: add a new content to a page
  - request body:
  ```json
  {
    "id": 1,
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
  [3, 1, 2, 5, 4]
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
    "id": 1,
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
    - `400 Bad Request` a page must alway contain at least one header and at least another content -->
- POST `/api/login`
  - description: login to receive `sessionId`
  - request body:
  ```json
  { "username": "bre@bre.it", "password": "password" }
  ```
  - response body:
  ```json
  {
    "id": 1,
    "email": "bre@bre.it",
    "name": "Brendon",
    "role": "admin"
  }
  ```
  - response status:
    - `201 Created`
    -
- GET `/api/login`
  - description: get if the user is logged in
  - request body: empty
  - response body:
  ```json
  {
    "id": 1,
    "email": "bre@bre.it",
    "name": "Brendon",
    "role": "admin"
  }
  ```
  - response status:
    - `200 OK`: **if authenticated**
    - `404 Not Found`: **if not authenticated**
    - `500 Server Interal Error`
- DELETE `/api/logout`
  - description:
- GET `/api/webpage/name`
  - description: get the name of the webpage
  - request body: empty
  - response body:
  ```json
  { "name": "Sito WebApp" }
  ```
  - response status:
    - `200 OK`
    - `500 Interal Server Error`
- POST `/api/webpage/name`
  - desription: update the name of the webpage, only Admins can access this route
  - request body:
  ```json
  { "name": "Sito WebApp" }
  ```
  - response body: empty
  - response status:
    - `204 No Content`
    - `400 Bad Request` wrong format
    - `401 Unauthorized`
    - `500 Internal Server Error`
- PUT `/api/register`
  - description: register new user (just for testing)
  - request body:
  ```json
  {
    "name": "Brendon",
    "role": "admin",
    "email": "s123456@studenti.polito.it",
    "password": "123456789"
  }
  ```
  - response body: empty
  - response status:
    - `204 No Content`
    - `500 Internal Server Error`

## Database Tables

- Table `users` - represent the registred users
  | `id` | `email` | `name` | `role` | `hash` | `salt` |
  |-|-|-|-|-|-|

- Table `pages` - represent the pages created by the users
  | `id` | `userId` | `title` | `creationDate` | `publicationDate` |
  |-|-|-|-|-|

  - `userId FOREIGN KEY users(id)` with `ON DELETE CASCADE`

- Table `contents` - represent a single content inside a page
  | `id` | `pageId` | `contentType` | `content` | `order` |
  |-|-|-|-|-|

  - `pageId FOREIGN KEY pages(id)` with `ON DELETE CASCADE`

- Table `webpage` - contains some informations about the webpage
  | `name` |
  |-|

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- `bre@bre.it`, `test` (Normal user)
- `test@test.it`, `test` (Normal user)
- `s@polito.it`, `poli` (Admin user)
- `boh@boh.xyz`, `supersecret` (Admin user)

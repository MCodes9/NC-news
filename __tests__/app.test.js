process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article matching the input article id passed as a parameter", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });
  test("400: Responds a bad request error message when passed an invalid endpoint id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds a 'Not Found' message when the article id does not exist on database", () => {
    return request(app)
      .get("/api/articles/999999999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the increased vote count", () => {
    const requestBody = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 150,
          })
        );
      });
  });
  test("200: Responds with the decreased vote count", () => {
    const requestBody = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(90);
      });
  });
  test("400: Responds a bad request error message when passed an invalid endpoint id", () => {
    const requestBody = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds a bad request error message when votes are not an integer", () => {
    const requestBody = { inc_votes: "Minus 10" };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds a bad request error message when request body is empty", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds a 'Not Found' message when the article id does not exist on database", () => {
    const requestBody = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/999999999")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
});

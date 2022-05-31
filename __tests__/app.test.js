process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const sorted = require("jest-sorted");

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

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Responds with the correct comment count for all articles", () => {
    const articlesIdArray = [3, 6, 2, 12, 5, 1, 9, 10, 4, 8, 11, 7];
    const commentCountArray = [2, 1, 0, 0, 2, 11, 2, 0, 0, 0, 0, 0];
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article, i) => {
          expect(article.article_id).toBe(articlesIdArray[i]);
          expect(parseInt(article.comment_count)).toBe(commentCountArray[i]);
        });
      });
  });
  test("200: Responds with the array of articles sorted by descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Responds with an array of articles sorted by any valid sort column", () => {
    return request(app)
      .get(`/api/articles?sort_by=comment_count`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted("comment_count", { descending: true });
      });
  });
  test("200: Responds with the array of articles sorted by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic");
      });
  });
  test("404: Responds with an error message when topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=some_other_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
  // test.only("404: Responds with a 'Not Found' message when the article id does not exist on database", () => {
  //   return request(app)
  //     .get("/api/articles")
  //     .expect(404)
  //     .then((response) => {
  //       response.body = { msg: "Article not found" };
  //     });
  // });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article matching the input article id", () => {
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
  test("200: Responds with the comment count for the article matching the input article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("400: Responds with a bad request error message when passed an invalid endpoint id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with a 'Not Found' message when the article id does not exist on database", () => {
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
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 90,
          })
        );
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
  test("400: Responds with a bad request error message when votes are not an integer", () => {
    const requestBody = { inc_votes: "Minus 10" };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with a bad request error message when request body is empty", () => {
    const requestBody = {};
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with a 'Not Found' message when the article id does not exist on database", () => {
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: Responds with an empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: Responds a bad request error message when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with a 'Not Found' message when the article id does not exist on database", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        response.body = { msg: "Article not found" };
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status: 201: Responds with a new posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Great insights",
    };
    return request(app)
      .post(`/api/articles/2/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newAddedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "Great insights",
            votes: expect.any(Number),
            author: "butter_bridge",
            created_at: expect.any(String),
            article_id: 2,
          })
        );
      });
  });
});
test("400: Responds with a bad request error message when datatype of article id is invalid", () => {
  const newComment = {
    username: "butter_bridge",
    body: "Great insights",
  };
  return request(app)
    .post("/api/articles/second/comments")
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body).toEqual({ msg: "Bad request" });
    });
});
test("400: Responds with bad request error message when datatype of request body properties are invalid", () => {
  const invalidInputComment = {
    username: 1,
    body: true,
  };
  return request(app)
    .post("/api/articles/2/comments")
    .send(invalidInputComment)
    .expect(400)
    .then(({ body }) => {
      expect(body).toEqual({ msg: "Bad request" });
    });
});
test("400: Responds with a bad request error message when comment is missing a username or body (request body is empty) ", () => {
  return request(app)
    .post("/api/articles/2/comments")
    .send({})
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Missing required field");
    });
});
test("404: Responds with a 'Not Found' message when the article id does not exist on the database", () => {
  const newComment = {
    username: "butter_bridge",
    body: "Great insights",
  };
  return request(app)
    .post("/api/articles/9999/comments")
    .send(newComment)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article not found");
    });
});
test("404: Responds with a 'Not Found' message when the username does not exist on the database", () => {
  const newComment = {
    username: "bridge_butter",
    body: "Great insights",
  };
  return request(app)
    .post("/api/articles/2/comments")
    .send(newComment)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Username not found");
    });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("DELETE /api/comments", () => {
  test("204: Deletes comment by comment_id", () => {
    return request(app).delete(`/api/comments/2`).expect(204);
  });
});

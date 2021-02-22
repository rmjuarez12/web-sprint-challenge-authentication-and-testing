const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async (done) => {
  await db.destroy();
  done();
});

test("sanity", () => {
  expect(true).not.toBe(false);
});

//* Mock user data
const newUser = {
  username: "rmjuarez1234",
  password: "XxTheBest",
};

describe("Auth Endpoints", () => {
  describe("Test [POST] /api/auth/register", () => {
    beforeEach(async () => {
      await db("users").truncate();
    });

    test("A new user is registered", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send(newUser);

      const user = res.body;

      expect(user).toHaveProperty("id", 1);
      expect(user).toHaveProperty("username", "rmjuarez1234");
      expect(user).toHaveProperty("password");
    });

    test("Ensure that the password is encrypted", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send(newUser);

      const user = res.body;

      expect(user.password).not.toBe(newUser.password);
      expect(user.password.length).toBeGreaterThan(20);
    });
  });

  describe("Test [POST] /api/auth/login", () => {
    beforeEach(async () => {
      await db("users").truncate();
      await request(server).post("/api/auth/register").send(newUser);
    });

    test("Login a user and get a token", async () => {
      const res = await request(server).post("/api/auth/login").send(newUser);
      const response = res.body;

      expect(response).toHaveProperty("message");
      expect(response).toHaveProperty("token");
    });

    test("Ensure you get the correct status code on login", async () => {
      const res = await request(server).post("/api/auth/login").send(newUser);
      const statusCode = res.status;

      expect(statusCode).toBe(200);
    }, 500);
  });

  describe("Test [GET] /api/jokes", () => {
    beforeEach(async () => {
      await db("users").truncate();
      await request(server).post("/api/auth/register").send(newUser);
    });

    test("Ensure a token is present that allows user access", async () => {
      const login = await request(server).post("/api/auth/login").send(newUser);
      expect(login.body).toHaveProperty("token");

      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", login.body.token);

      expect(res.body.length).toBeGreaterThan(0);
    }, 500);

    test("Ensure you get the correct status code on the request", async () => {
      const login = await request(server).post("/api/auth/login").send(newUser);

      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", login.body.token);

      const statusCode = res.status;

      expect(statusCode).toBe(200);
    }, 500);
  });
});

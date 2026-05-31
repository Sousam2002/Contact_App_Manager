const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");

const { app } = require("../server");
const User = require("../models/userModel");
const { createTestClient } = require("./helpers/httpTestClient");

process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test-secret";

const client = createTestClient(app);

const originalMethods = {
  findOne: User.findOne,
  create: User.create,
  findById: User.findById,
};

const resetUserModelMocks = () => {
  User.findOne = originalMethods.findOne;
  User.create = originalMethods.create;
  User.findById = originalMethods.findById;
};

test.beforeEach(() => {
  resetUserModelMocks();
});

test.after(async () => {
  resetUserModelMocks();
  await client.stop();
});

test("POST /api/users/register returns 400 when required fields are missing", async () => {
  User.findOne = async () => null;

  const response = await client.request("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "missing@example.com" }),
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.title, "Validation Failed");
  assert.match(response.body.message, /All fields are mandatory/i);
});

test("POST /api/users/login returns a token for valid credentials", async () => {
  const hashedPassword = await bcrypt.hash("Password123", 10);
  User.findOne = async ({ email }) => ({
    id: "user-1",
    username: "Saman",
    email,
    password: hashedPassword,
  });

  const response = await client.request("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "saman@example.com", password: "Password123" }),
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.username, "Saman");
  assert.equal(response.body.user_id, "user-1");
  assert.ok(response.body.token);
});

test("GET /api/users/currentUser rejects missing or malformed tokens", async () => {
  let response = await client.request("/api/users/currentUser");

  assert.equal(response.status, 401);
  assert.equal(response.body.title, "Unauthorized");
  assert.match(response.body.message, /missing or malformed/i);

  response = await client.request("/api/users/currentUser", {
    headers: {
      Authorization: "Invalid token-value",
    },
  });

  assert.equal(response.status, 401);
  assert.match(response.body.message, /missing or malformed/i);
});

test("GET /api/users/currentUser rejects invalid tokens", async () => {
  const response = await client.request("/api/users/currentUser", {
    headers: {
      Authorization: "Bearer not-a-real-token",
    },
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.title, "Unauthorized");
  assert.match(response.body.message, /not authorized/i);
});

test("GET /api/users/currentUser returns the authenticated user profile", async () => {
  const loginPassword = "Password123";
  const hashedPassword = await bcrypt.hash(loginPassword, 10);

  User.findOne = async ({ email }) => ({
    id: "user-22",
    username: "Ria",
    email,
    password: hashedPassword,
  });

  User.findById = () => ({
    select: async () => ({
      id: "user-22",
      username: "Ria",
      email: "ria@example.com",
      createdAt: "2026-05-30T00:00:00.000Z",
      updatedAt: "2026-05-30T00:00:00.000Z",
    }),
  });

  const loginResponse = await client.request("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ria@example.com", password: loginPassword }),
  });

  const response = await client.request("/api/users/currentUser", {
    headers: {
      Authorization: `Bearer ${loginResponse.body.token}`,
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.body._id, "user-22");
  assert.equal(response.body.username, "Ria");
  assert.equal(response.body.email, "ria@example.com");
});

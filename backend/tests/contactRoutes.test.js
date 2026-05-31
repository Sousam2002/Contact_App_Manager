const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { app } = require("../server");
const Contact = require("../models/contactModel");
const User = require("../models/userModel");
const { createTestClient } = require("./helpers/httpTestClient");

process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test-secret";

const client = createTestClient(app);

const originalMethods = {
  find: Contact.find,
  create: Contact.create,
  findById: Contact.findById,
  findByIdAndUpdate: Contact.findByIdAndUpdate,
  deleteOne: Contact.deleteOne,
  userFindOne: User.findOne,
};

const resetContactModelMocks = () => {
  Contact.find = originalMethods.find;
  Contact.create = originalMethods.create;
  Contact.findById = originalMethods.findById;
  Contact.findByIdAndUpdate = originalMethods.findByIdAndUpdate;
  Contact.deleteOne = originalMethods.deleteOne;
  User.findOne = originalMethods.userFindOne;
};

const createToken = (user) =>
  jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

test.beforeEach(() => {
  resetContactModelMocks();
});

test.after(async () => {
  resetContactModelMocks();
  await client.stop();
});

test("GET /api/contacts blocks unauthenticated requests", async () => {
  const response = await client.request("/api/contacts");

  assert.equal(response.status, 401);
  assert.equal(response.body.title, "Unauthorized");
  assert.match(response.body.message, /missing or malformed/i);
});

test("GET /api/contacts returns only the authenticated user's contacts", async () => {
  const token = createToken({ id: "user-1", email: "one@example.com", username: "One" });
  Contact.find = async ({ user_id }) => [
    {
      _id: "contact-1",
      name: "Alex",
      email: "alex@example.com",
      phone: "1234567890",
      user_id,
    },
  ];

  const response = await client.request("/api/contacts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].user_id, "user-1");
});

test("POST /api/contacts returns 400 when contact fields are missing", async () => {
  const token = createToken({ id: "user-1", email: "one@example.com", username: "One" });

  const response = await client.request("/api/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Only name" }),
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.title, "Validation Failed");
  assert.match(response.body.message, /All fields are mandatory/i);
});

test("GET /api/contacts/:id rejects access to another user's contact", async () => {
  const token = createToken({ id: "user-1", email: "one@example.com", username: "One" });
  Contact.findById = async () => ({
    _id: "contact-2",
    user_id: {
      toString: () => "user-2",
    },
  });

  const response = await client.request("/api/contacts/contact-2", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  assert.equal(response.status, 403);
  assert.equal(response.body.title, "Forbidden");
  assert.match(response.body.message, /permission/i);
});

test("PUT /api/contacts/:id rejects updates to another user's contact", async () => {
  const token = createToken({ id: "user-1", email: "one@example.com", username: "One" });
  Contact.findById = async () => ({
    _id: "contact-2",
    user_id: {
      toString: () => "user-2",
    },
  });

  const response = await client.request("/api/contacts/contact-2", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Changed" }),
  });

  assert.equal(response.status, 403);
  assert.equal(response.body.title, "Forbidden");
});

test("DELETE /api/contacts/:id rejects deletes for another user's contact", async () => {
  const token = createToken({ id: "user-1", email: "one@example.com", username: "One" });
  Contact.findById = async () => ({
    _id: "contact-2",
    user_id: {
      toString: () => "user-2",
    },
  });

  const response = await client.request("/api/contacts/contact-2", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  assert.equal(response.status, 403);
  assert.equal(response.body.title, "Forbidden");
});

test("integration: login can create and retrieve contacts through the protected routes", async () => {
  const contacts = [];
  const hashedPassword = await bcrypt.hash("Password123", 10);

  User.findOne = async ({ email }) => ({
    id: "user-7",
    username: "Seven",
    email,
    password: hashedPassword,
  });

  Contact.create = async (payload) => {
    const contact = {
      _id: `contact-${contacts.length + 1}`,
      ...payload,
    };
    contacts.push(contact);
    return contact;
  };

  Contact.find = async ({ user_id }) => contacts.filter((contact) => contact.user_id === user_id);

  const loginResponse = await client.request("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "seven@example.com",
      password: "Password123",
    }),
  });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);

  const createResponse = await client.request("/api/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${loginResponse.body.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Robin",
      email: "robin@example.com",
      phone: "9876543210",
    }),
  });

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.name, "Robin");

  const listResponse = await client.request("/api/contacts", {
    headers: {
      Authorization: `Bearer ${loginResponse.body.token}`,
    },
  });

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.length, 1);
  assert.equal(listResponse.body[0].email, "robin@example.com");
});

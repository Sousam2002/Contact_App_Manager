import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";
import userReducer from "./features/userSlice";
import contactsReducer from "./features/contactSlice";
import * as authApi from "./services/authApi";
import * as contactApi from "./services/contactApi";
import * as cookiesHandler from "./cookiesHandler";

jest.mock("./services/authApi");
jest.mock("./services/contactApi");
jest.mock("./cookiesHandler");
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  get: jest.fn(),
}));

const renderApp = ({ route = "/", preloadedState } = {}) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      contacts: contactsReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

const getRegisterForm = () =>
  screen.getByRole("heading", { name: /register/i }).closest(".register-container");

const getLoginForm = () =>
  screen.getByRole("heading", { name: /login/i }).closest(".login-container");

beforeEach(() => {
  jest.clearAllMocks();
  axios.get.mockRejectedValue(new Error("avatar unavailable"));
  cookiesHandler.getAuthSession.mockReturnValue({
    token: null,
    userId: null,
    username: null,
  });
  cookiesHandler.setAuthSession.mockImplementation(() => {});
  cookiesHandler.clearAuthSession.mockImplementation(() => {});
  authApi.registerUser.mockResolvedValue({ username: "New User" });
  authApi.loginUser.mockResolvedValue({
    username: "Ria",
    user_id: "user-1",
    token: "token-1",
  });
  contactApi.fetchContactsRequest.mockResolvedValue([]);
  contactApi.createContactRequest.mockResolvedValue({
    _id: "contact-2",
    name: "Robin",
    email: "robin@example.com",
    phone: "9876543210",
  });
  contactApi.updateContactRequest.mockResolvedValue({
    _id: "contact-1",
    name: "Alex Updated",
    email: "alex@example.com",
    phone: "1234567890",
  });
  contactApi.deleteContactRequest.mockResolvedValue({});
});

test("registers a new user from the auth screen", async () => {
  renderApp({ route: "/auth" });

  const registerForm = getRegisterForm();

  await userEvent.type(within(registerForm).getByLabelText(/username/i), "New User");
  await userEvent.type(within(registerForm).getByLabelText(/email/i), "new@example.com");
  await userEvent.type(within(registerForm).getByLabelText(/password/i), "Password123");
  await userEvent.click(within(registerForm).getByRole("button", { name: /^register$/i }));

  await screen.findByText(/registered successfully/i);

  expect(authApi.registerUser).toHaveBeenCalledWith({
    username: "New User",
    email: "new@example.com",
    password: "Password123",
  });
});

test("redirects unauthenticated users away from protected contacts", async () => {
  renderApp({ route: "/contacts" });

  await screen.findByRole("heading", { name: /register/i });

  expect(contactApi.fetchContactsRequest).not.toHaveBeenCalled();
});

test("logs in from the auth screen and loads the contacts page", async () => {
  contactApi.fetchContactsRequest.mockResolvedValue([
    {
      _id: "contact-1",
      name: "Alex Doe",
      email: "alex@example.com",
      phone: "1234567890",
      createdAt: "2026-05-30T00:00:00.000Z",
    },
  ]);

  renderApp({ route: "/auth" });

  const loginForm = getLoginForm();

  await userEvent.type(within(loginForm).getByLabelText(/email/i), "ria@example.com");
  await userEvent.type(within(loginForm).getByLabelText(/password/i), "Password123");
  await userEvent.click(within(loginForm).getByRole("button", { name: /^login$/i }));

  await screen.findByText("ALEX DOE");

  expect(authApi.loginUser).toHaveBeenCalledWith({
    email: "ria@example.com",
    password: "Password123",
  });
  expect(cookiesHandler.setAuthSession).toHaveBeenCalledWith({
    username: "Ria",
    user_id: "user-1",
    token: "token-1",
  });
  expect(contactApi.fetchContactsRequest).toHaveBeenCalledWith("token-1");
});

test("supports contact create, update, and delete flows for authenticated users", async () => {
  contactApi.fetchContactsRequest.mockResolvedValue([
    {
      _id: "contact-1",
      name: "Alex Doe",
      email: "alex@example.com",
      phone: "1234567890",
      createdAt: "2026-05-30T00:00:00.000Z",
    },
  ]);

  renderApp({
    route: "/contacts",
    preloadedState: {
      user: {
        username: "Ria",
        userId: "user-1",
        token: "token-1",
        error: null,
      },
      contacts: undefined,
    },
  });

  await screen.findByText("ALEX DOE");

  await userEvent.type(screen.getByLabelText(/^name:/i), "Robin");
  await userEvent.type(screen.getByLabelText(/^email:/i), "robin@example.com");
  await userEvent.type(screen.getByLabelText(/^phone:/i), "9876543210");
  await userEvent.click(screen.getByRole("button", { name: /^add contact$/i }));

  await screen.findByText("ROBIN");
  expect(contactApi.createContactRequest).toHaveBeenCalledWith("token-1", {
    name: "Robin",
    email: "robin@example.com",
    phone: "9876543210",
  });

  const alexCard = screen.getByText("ALEX DOE").closest(".eachcontact");
  await userEvent.click(within(alexCard).getByRole("button", { name: /^edit$/i }));
  const nameInput = screen.getByLabelText(/^name:/i);
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, "Alex Updated");
  await userEvent.click(screen.getByRole("button", { name: /save contact/i }));

  await screen.findByText("ALEX UPDATED");
  expect(contactApi.updateContactRequest).toHaveBeenCalledWith("token-1", "contact-1", {
    name: "Alex Updated",
    email: "alex@example.com",
    phone: "1234567890",
  });

  const updatedAlexCard = screen.getByText("ALEX UPDATED").closest(".eachcontact");
  await userEvent.click(within(updatedAlexCard).getByRole("button", { name: /^delete$/i }));
  const dialog = await screen.findByRole("dialog");
  await userEvent.click(within(dialog).getByRole("button", { name: /^delete$/i }));

  await waitFor(() => {
    expect(screen.queryByText("ALEX UPDATED")).not.toBeInTheDocument();
  });
  expect(contactApi.deleteContactRequest).toHaveBeenCalledWith("token-1", "contact-1");
});

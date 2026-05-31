import Cookies from "js-cookie";

const AUTH_EXPIRATION_DAYS = 1 / 24;
const authCookieOptions = {
  expires: AUTH_EXPIRATION_DAYS,
  sameSite: "strict",
};

export const AUTH_COOKIE_KEYS = {
  token: "token",
  userId: "user_id",
  username: "username",
};

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, {
    ...authCookieOptions,
    ...options,
  });
};

export const getCookie = (name) => Cookies.get(name) || null;

export const removeCookie = (name) => {
  Cookies.remove(name);
};

export const setAuthSession = ({ token, user_id, userId, username }) => {
  const resolvedUserId = userId || user_id;

  if (!token || !resolvedUserId || !username) {
    return;
  }

  setCookie(AUTH_COOKIE_KEYS.token, token);
  setCookie(AUTH_COOKIE_KEYS.userId, resolvedUserId);
  setCookie(AUTH_COOKIE_KEYS.username, username);
};

export const getAuthSession = () => ({
  token: getCookie(AUTH_COOKIE_KEYS.token),
  userId: getCookie(AUTH_COOKIE_KEYS.userId),
  username: getCookie(AUTH_COOKIE_KEYS.username),
});

export const clearAuthSession = () => {
  removeCookie(AUTH_COOKIE_KEYS.token);
  removeCookie(AUTH_COOKIE_KEYS.userId);
  removeCookie(AUTH_COOKIE_KEYS.username);
};

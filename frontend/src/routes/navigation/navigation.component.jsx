import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { resetContactsState } from "../../features/contactSlice";
import { setUser } from "../../features/userSlice";
import "./navigation.component.css";
import { clearAuthSession, getAuthSession } from "../../cookiesHandler";
import { clearUser } from "../../features/userSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const session = getAuthSession();
  const isAuthenticated = Boolean(user.token || session.token);

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " nav-link-active" : ""}`;

  useEffect(() => {
    const { username, userId, token } = getAuthSession();

    if (username && userId && token && !user.token) {
      dispatch(
        setUser({
          username,
          userId,
          token,
        })
      );
    }
  }, [dispatch, user.token]);

  const logoutHandler = () => {
    dispatch(clearUser());
    dispatch(resetContactsState());
    clearAuthSession();
    navigate("/auth", {
      state: {
        message: "Successfully logged out.",
        type: "success",
      },
    });
  };

  return (
    <>
      <div className="navigation-container">
        <Link to="/" className="navigation-brand">
          <img src={logo} alt="logo" className="logo" />
          <div className="brand-copy">
            <span className="brand-title">Contact Manager</span>
            <span className="brand-subtitle">Personal contact workspace</span>
          </div>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={navLinkClass}>
            HOME
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            ABOUT
          </NavLink>
          {!isAuthenticated ? (
            <NavLink to="/auth" className={navLinkClass}>
              SIGN IN
            </NavLink>
          ) : (
            <>
              <NavLink to="/contacts" className={navLinkClass}>
                CONTACTS
              </NavLink>
              <button type="button" onClick={logoutHandler} className="nav-button">
                SIGN OUT
              </button>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;

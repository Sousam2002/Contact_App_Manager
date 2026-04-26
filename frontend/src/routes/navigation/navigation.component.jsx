import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/userSlice";
import "./navigation.component.css";
import { getCookie } from "../../cookiesHandler";
// import { Logout } from '../../components/logout/logout';
import { clearUser } from "../../features/userSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const storedUsername = getCookie("username");
    const storedUserId = getCookie("user_id");
    const storedToken = getCookie("token");
    if (storedUsername && !user.username) {
      dispatch(
        setUser({
          username: storedUsername,
          user_id: storedUserId,
          token: storedToken,
        })
      );
    }
  }, [dispatch, user]);

  const logoutHandler = () => {
    dispatch(clearUser());
    // // clear all cookie related to that user
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    alert("Successfully logged out");
    navigate('/auth');
  };

  return (
    <>
      <div className="navigation-container">
        <img src={logo} alt="logo" className="logo" />
        <div className="nav-links">
          <NavLink to="/" className="active">
            HOME
          </NavLink>
          <NavLink to="/about" className="active">
            ABOUT
          </NavLink>
          {!user.username ? (
            <NavLink to="/auth" className="active">
              SIGN IN
            </NavLink>
          ) : (
            <>
              <NavLink to="/contacts" className="active">
                CONTACTS
              </NavLink>
              <NavLink to="/auth" onClick={logoutHandler} className="active">
                SIGN OUT
              </NavLink>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;

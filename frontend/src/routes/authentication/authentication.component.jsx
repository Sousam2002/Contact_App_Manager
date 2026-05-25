import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../../components/login/login";
import Register from "../../components/register/register";
import AuthNotice from "../../components/authNotice/authNotice";
import "./authentication.component.css";

const Authentication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const pageFeedback = location.state?.message
    ? { message: location.state.message, type: location.state.type || "info" }
    : null;

  useEffect(() => {
    if (user.token) {
      navigate("/contacts");
    }
  }, [navigate, user.token]);

  return (
    <div className="window">
      <div className="auth-window-content">
        <AuthNotice
          message={pageFeedback?.message}
          type={pageFeedback?.type}
        />
        <div className="auth-forms">
          <Register />
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Authentication;

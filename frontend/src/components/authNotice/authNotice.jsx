import "./authNotice.css";

const AuthNotice = ({ message, type = "info" }) => {
  if (!message) {
    return null;
  }

  return <div className={`auth-notice auth-notice-${type}`}>{message}</div>;
};

export default AuthNotice;

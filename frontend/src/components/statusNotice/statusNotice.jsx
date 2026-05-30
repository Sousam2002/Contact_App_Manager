import "./statusNotice.css";

const StatusNotice = ({ message, type = "info" }) => {
  if (!message) {
    return null;
  }

  return <div className={`status-notice status-notice-${type}`}>{message}</div>;
};

export default StatusNotice;

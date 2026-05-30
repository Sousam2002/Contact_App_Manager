import "./about.component.css";

const About = () => {
  return (
    <section className="about-page">
      <div className="about-card">
        <p className="about-kicker">About This Project</p>
        <h1>Why this Contact Manager exists</h1>
        <p>
          This app is designed to give each authenticated user a personal,
          private place to store contact details and manage them through a
          simple CRUD workflow.
        </p>
        <div className="about-grid">
          <article>
            <h2>Frontend</h2>
            <p>React, Redux Toolkit, React Router, reusable status messaging, and protected routes.</p>
          </article>
          <article>
            <h2>Backend</h2>
            <p>Express, MongoDB, Mongoose, JWT authentication, and user-scoped contact access.</p>
          </article>
          <article>
            <h2>Current Direction</h2>
            <p>The frontend now uses centralized API services, cleaner session helpers, and stronger navigation flows.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;

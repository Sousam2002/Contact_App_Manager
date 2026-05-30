import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./home.component.css";

const Home = () => {
  const user = useSelector((state) => state.user);
  const isAuthenticated = Boolean(user.token);

  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="hero-kicker">Contact Manager</p>
        <h1>Keep your people, details, and follow-ups organized in one place.</h1>
        <p className="hero-copy">
          A focused React and Express contact tracker with authentication,
          personal contact storage, and a cleaner workflow for everyday use.
        </p>
        <div className="hero-actions">
          <Link className="hero-primary" to={isAuthenticated ? "/contacts" : "/auth"}>
            {isAuthenticated ? "Open Contacts" : "Get Started"}
          </Link>
          <Link className="hero-secondary" to="/about">
            Learn More
          </Link>
        </div>
      </div>

      <div className="home-panels">
        <article className="home-panel">
          <h2>Private by default</h2>
          <p>Your contacts stay tied to your account, with token-protected access on the backend.</p>
        </article>
        <article className="home-panel">
          <h2>Built for quick edits</h2>
          <p>Create, review, and update entries without losing context or reloading the page.</p>
        </article>
        <article className="home-panel">
          <h2>Ready to extend</h2>
          <p>The app now has cleaner routes, shared API services, and a stronger state model to build on.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;

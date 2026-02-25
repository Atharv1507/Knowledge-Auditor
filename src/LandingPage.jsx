import "./LandingPage.css";

function LandingPage({ setLandingPageActive, setLoginPageActive }) {
  const features = [
    {
      title: "Save bookmarks",
      desc: "Paste any URL and we fetch title and description automatically.",
      icon: "link",
    },
    {
      title: "Define projects",
      desc: "Create projects with due dates and details. Set priority (High, Medium, Low).",
      icon: "folder",
    },
    {
      title: "AI mapping",
      desc: "Map Links uses Gemini to match your bookmarks to the right projects.",
      icon: "wand-magic-sparkles",
    },
  ];

  const FEEDBACK_EMAIL = "feedback@knowledgeauditor.com";

  return (
    <div className="landing">
      <header className="landing-header landing-animate" style={{ animationDelay: "0.1s" }}>
        <h1 className="landing-logo">
          Knowledge <span className="title-accent">auditor</span>
        </h1>
      </header>

      <main className="landing-main">
        <section className="landing-hero landing-animate" style={{ animationDelay: "0.25s" }}>
          <h2 className="landing-tagline">
            Organize bookmarks. Link them to projects. Let AI help.
          </h2>
          <p className="landing-sub">
            Save URLs, define projects, and map relevant links—manually or with AI.
          </p>
          <button
            type="button"
            className="primary-button landing-cta"
            onClick={() => {
              setLandingPageActive(false);
              setLoginPageActive(true);
            }}
          >
            Get started
          </button>
        </section>

        <section className="landing-features">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="landing-feature-card landing-animate"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="landing-feature-icon">
                <i className={`fa-solid fa-${f.icon}`} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="landing-contact landing-animate" style={{ animationDelay: "0.85s" }}>
          <p className="landing-contact-label">Questions or feedback?</p>
          <a
            href={`mailto:${FEEDBACK_EMAIL}`}
            className="landing-contact-link"
          >
            <i className="fa-solid fa-envelope" />
            {FEEDBACK_EMAIL}
          </a>
        </section>
      </main>

      <footer className="landing-footer landing-animate" style={{ animationDelay: "1s" }}>
        <p>Save · Organize · Map</p>
      </footer>
    </div>
  );
}

export default LandingPage;

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const routes = [
  {
    id: "01",
    bus: "OCT Bus 01",
    destination: "Indore",
    time: "07:30 AM",
    pickup: "Bhopal",
    stops: ["Bhopal", "Sehore", "Dewas", "Indore"],
    count: "08 stops",
    image: "/images/bus-01.jpg",
  },
  {
    id: "02",
    bus: "OCT Bus 02",
    destination: "Sehore",
    time: "08:00 AM",
    pickup: "Bhopal",
    stops: ["Bhopal", "Mandideep", "Sehore"],
    count: "06 stops",
    image: "/images/bus-02.jpg",
  },
  {
    id: "03",
    bus: "OCT Bus 03",
    destination: "Kalapipal",
    time: "08:30 AM",
    pickup: "Bhopal",
    stops: ["Bhopal", "Sehore", "Ashta", "Kalapipal"],
    count: "07 stops",
    image: "/images/bus-03.jpg",
  },
];

const questions = [
  {
    question: "How do I find my assigned bus?",
    answer:
      "Search by bus number, route or pickup point in the finder above. If you are unsure of your allocation, confirm it with the college transport office.",
  },
  {
    question: "Are bus timings fixed?",
    answer:
      "The times shown are scheduled departure times and may change. Please check with the transport office for the latest updates before travelling.",
  },
  {
    question: "How do I know my pickup point?",
    answer:
      "Choose your route to see its listed stops, then confirm the exact pickup point with the transport office or your route coordinator.",
  },
  {
    question: "What if I miss my bus?",
    answer:
      "Contact the transport office as soon as possible for guidance. Please do not assume another bus can accommodate you without checking first.",
  },
  {
    question: "Can I request a bus change?",
    answer:
      "Bus allocation changes are managed by the college. Please speak with the transport office to ask about availability and the process.",
  },
];

const team = [
  ["Ashish Mewada", "Product & AI", "AM"],
  ["Deepansh Patel", "Development", "DP"],
  ["Harsh Jain", "Development", "HJ"],
  ["Ishant Khushwaha", "Product & Research", "IK"],
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {diagonal ? (
        <>
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </>
      ) : (
        <>
          <path d="M4 12h15" />
          <path d="m13 6 6 6-6 6" />
        </>
      )}
    </svg>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`brand${inverse ? " brand--inverse" : ""}`} href="#home" aria-label="OCT RIDE home">
      <span className="brand__mark" aria-hidden="true">O</span>
      <span className="brand__wording">
        <strong>OCT RIDE</strong>
        <small>CAMPUS MOBILITY</small>
      </span>
    </a>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const matchingRoutes = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return routes;
    return routes.filter((route) =>
      [route.bus, route.destination, route.time, route.pickup, ...route.stops]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query]);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <div className="oct-site">
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a className="nav-active" href="#home">Home</a>
            <a href="#find-bus">Find Bus</a>
            <a href="#routes">Routes</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="button button--nav" href="#find-bus">Find My Bus <ArrowIcon /></a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span />
          </button>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          {[
            ["Home", "#home"],
            ["Find Bus", "#find-bus"],
            ["Routes", "#routes"],
            ["About", "#about"],
            ["FAQ", "#faq"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a href={href} key={href} onClick={closeMenu}>{label}</a>
          ))}
          <a className="mobile-nav__cta" href="#find-bus" onClick={closeMenu}>Find My Bus <ArrowIcon /></a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> CAMPUS TRANSPORT, SIMPLIFIED</div>
            <h1><span className="hero-line">Know your bus.</span><br /><span>Ride easy.</span></h1>
            <p className="hero-description">
              Find your assigned bus, check your route, discover pickup points and reach campus without the confusion.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#find-bus">Find My Bus <ArrowIcon /></a>
              <a className="button button--text" href="#routes">Explore routes <ArrowIcon /></a>
            </div>
            <div className="hero-footnote">
              <span className="avatar-stack" aria-hidden="true"><i>O</i><i>R</i><i>+</i></span>
              <span>Campus mobility,<br /><strong>made simple.</strong></span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image" role="img" aria-label="Oriental College of Technology campus">
              <div className="image-shade" />
              <div className="hero-image-caption"><span>ORIENTAL COLLEGE OF TECHNOLOGY</span><span>BHOPAL, INDIA</span></div>
            </div>
            <div className="floating-card floating-card--route">
              <span className="mini-label">YOUR MORNING RIDE</span>
              <strong>Bhopal <span>→</span> Indore</strong>
              <span className="route-card-meta">OCT Bus 01 <i /> 08 stops</span>
            </div>
            <div className="floating-card floating-card--time">
              <span className="time-icon"><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
              <span><small>DEPARTURE</small><strong>07:30 AM</strong></span>
            </div>
            <div className="hero-image-index"><span>01</span><span className="index-line" /><span>03</span></div>
          </div>
          <div className="hero-bottom">
            <span>DESIGNED FOR THE DAILY COMMUTE</span>
            <span>ORIENTAL COLLEGE OF TECHNOLOGY <span className="hero-bottom-dot">·</span> BHOPAL</span>
          </div>
        </section>

        <section className="finder section-pad" id="find-bus">
          <div className="content-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="section-kicker">THE BUS FINDER</p>
                <h2>Your bus. One<br className="desktop-break" /> search away.</h2>
              </div>
              <p className="section-intro">Look up a bus, route or pickup point. Your next ride starts with a little less guesswork.</p>
            </div>
            <label className="search-box">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bus, route or pickup point..."
                aria-label="Search bus, route or pickup point"
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="finder-results">
              <div className="results-label"><span>AVAILABLE ROUTES</span><span>{String(matchingRoutes.length).padStart(2, "0")} RESULTS</span></div>
              {matchingRoutes.length ? matchingRoutes.map((route) => (
                <a className="bus-row" href="#routes" key={route.id}>
                  <span className="bus-number">{route.id}</span>
                  <span className="bus-main"><strong>{route.bus}</strong><span>{route.pickup} <i>→</i> {route.destination}</span></span>
                  <span className="bus-time"><small>DEPARTS</small><strong>{route.time}</strong></span>
                  <span className="bus-stops"><small>PICKUP · {route.pickup.toUpperCase()}</small><strong>{route.count}</strong></span>
                  <span className="row-arrow"><ArrowIcon diagonal /></span>
                </a>
              )) : (
                <div className="empty-results">
                  <strong>No routes found</strong>
                  <span>Try a bus number, destination or pickup point.</span>
                </div>
              )}
            </div>
            <p className="finder-note"><span>i</span> Route details are provided as a guide. Please confirm your assigned bus and timings with the transport office.</p>
          </div>
        </section>

        <section className="how section-pad" id="how-it-works">
          <div className="content-width">
            <div className="section-heading">
              <p className="section-kicker">A BETTER WAY TO GET THERE</p>
              <h2>Three steps.<br /><span>Zero confusion.</span></h2>
            </div>
            <div className="steps">
              {[
                ["01", "FIND YOUR BUS", "Search your bus number, route or pickup location."],
                ["02", "CHECK YOUR ROUTE", "View stops, timing and destination clearly."],
                ["03", "START YOUR RIDE", "Reach your pickup point and ride to campus."],
              ].map(([number, title, description], index) => (
                <article className="step" key={number}>
                  <div className="step-marker"><span>{number}</span>{index < 2 && <i />}</div>
                  <p className="step-index">STEP {number}</p>
                  <h3>{title}</h3>
                  <p className="step-description">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="routes-section section-pad" id="routes">
          <div className="content-width">
            <div className="section-heading section-heading--split">
              <div><p className="section-kicker">THE DAILY LINEUP</p><h2>Popular routes.</h2></div>
              <a className="text-link" href="#find-bus">Find your route <ArrowIcon /></a>
            </div>
            <div className="route-grid">
              {routes.map((route) => (
                <article className="route-tile" key={route.id}>
                  <div className="route-tile-top"><span className="route-large-number">{route.id}</span><span className="route-tile-tag">{route.bus}</span></div>
                  <h3>Bhopal <span>→</span> {route.destination}</h3>
                  <p className="route-departure">DEPARTS <strong>{route.time}</strong></p>
                  <div className="stop-line" aria-label={`Route stops: ${route.stops.join(", ")}`}>
                    {route.stops.map((stop, index) => (
                      <span className="stop" key={stop}><i />{stop}{index < route.stops.length - 1 && <b />}</span>
                    ))}
                  </div>
                  <a className="route-link" href="#find-bus">View bus details <ArrowIcon diagonal /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="campus-story section-pad">
          <div className="content-width campus-layout">
            <div className="campus-photo">
              <div className="campus-photo-label"><span className="status-dot" /> ORIENTAL COLLEGE · BHOPAL</div>
              <div className="campus-photo-number">OCT <span>RIDE</span></div>
            </div>
            <div className="campus-copy">
              <p className="section-kicker">A LITTLE CLOSER TO CAMPUS</p>
              <h2>Built for<br />everyday<br /><span>campus travel.</span></h2>
              <p>From your first pickup to the campus gates, OCT RIDE makes the everyday journey easier to understand.</p>
              <a className="text-link" href="#about">Meet your mobility companion <ArrowIcon /></a>
              <div className="campus-route-mini">
                <span className="mini-route-number">01</span><span><small>POPULAR MORNING ROUTE</small><strong>Bhopal <i>→</i> Indore</strong></span><span className="mini-route-time">07:30 AM</span>
              </div>
              <div className="campus-route-mini">
                <span className="mini-route-number">02</span><span><small>ANOTHER WAY TO CAMPUS</small><strong>Bhopal <i>→</i> Sehore</strong></span><span className="mini-route-time">08:00 AM</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="content-width">
            <div className="section-heading section-heading--split">
              <div><p className="section-kicker">WHY WE BUILT THIS</p><h2>Getting to campus<br />should be simple.</h2></div>
              <p className="section-intro">Students currently depend on manually asking for bus numbers, routes and timings. OCT RIDE brings that information into one simple digital experience.</p>
            </div>
            <div className="about-cards">
              <article className="about-card">
                <span className="about-card-index">01 / THE NEED</span>
                <div className="about-card-icon"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 18V6l8 6 8-6v12" /><path d="M4 6h16" /></svg></div>
                <h3>Why OCT RIDE?</h3>
                <p>Replace manual bus enquiries with a clear, accessible digital transport system.</p>
                <span className="about-card-foot">CLARITY, BEFORE THE COMMUTE</span>
              </article>
              <article className="about-card about-card--blue">
                <span className="about-card-index">02 / THE GOAL</span>
                <div className="about-card-icon"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg></div>
                <h3>Our goal</h3>
                <p>Make campus transportation easier to understand, easier to access and easier to manage.</p>
                <span className="about-card-foot">A BETTER EVERYDAY RIDE</span>
              </article>
            </div>
          </div>
        </section>

        <section className="team-section section-pad" id="team">
          <div className="content-width">
            <div className="section-heading section-heading--split">
              <div><p className="section-kicker">THE PEOPLE BEHIND THE RIDE</p><h2>Built by students,<br /><span>for students.</span></h2></div>
              <p className="section-intro">A student team working to make a real campus challenge a little easier, one ride at a time.</p>
            </div>
            <div className="team-photo-placeholder" role="img" aria-label="Placeholder for an OCT RIDE team photograph">
              <div className="team-photo-outline" aria-hidden="true"><span /><span /><span /><span /></div>
              <div className="team-photo-copy"><span className="photo-placeholder-icon">+</span><strong>Your team, together.</strong><span>Add your OCT RIDE team photograph here</span><small>WIDE LANDSCAPE · TEAM PHOTO</small></div>
              <span className="photo-corner photo-corner--one" /><span className="photo-corner photo-corner--two" />
              <div className="photo-placeholder-note">A REAL TEAM PHOTO BELONGS HERE</div>
            </div>
            <div className="team-grid">
              {team.map(([name, role, initials], index) => (
                <article className="team-card" key={name}>
                  <span className="team-card-index">0{index + 1}</span>
                  <span className="team-initials">{initials}</span>
                  <p>{role}</p><h3>{name}</h3>
                  <span className="team-card-arrow"><ArrowIcon diagonal /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="content-width faq-layout">
            <div className="faq-intro"><p className="section-kicker">GOOD TO KNOW</p><h2>Questions,<br /><span>answered.</span></h2><p>Everything you need to know before you set off.</p></div>
            <div className="faq-list">
              {questions.map(({ question, answer }, index) => (
                <details className="faq-item" key={question}>
                  <summary><span className="faq-number">0{index + 1}</span><span>{question}</span><i aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="content-width">
            <div className="section-heading section-heading--split">
              <div><p className="section-kicker">HERE WHEN YOU NEED US</p><h2>Need help<br />with your ride?</h2></div>
              <p className="section-intro">For route details, bus allocation and the latest information, reach out to the right place.</p>
            </div>
            <div className="support-grid" id="support-options">
              {[
                ["01", "TRANSPORT OFFICE", "Get help with bus allocation and route information.", "BUS & ROUTE HELP"],
                ["02", "REPORT AN ISSUE", "Report incorrect bus, route or timing information.", "ROUTE INFORMATION"],
                ["03", "STUDENT FEEDBACK", "Share suggestions to improve campus transport.", "SHARE YOUR THOUGHTS"],
              ].map(([number, title, copy, label]) => (
                <a className="support-card" href="#contact-cta" key={number}>
                  <span className="support-index">{number}</span><span className="support-arrow"><ArrowIcon diagonal /></span>
                  <h3>{title}</h3><p>{copy}</p><span className="support-label">{label} <ArrowIcon /></span>
                </a>
              ))}
            </div>
            <div className="contact-cta" id="contact-cta">
              <div><p className="section-kicker">WE’RE LISTENING</p><h3>Something not right?</h3><p>Let us know and help improve the ride.</p></div>
              <a className="button button--light" href="#support-options">Contact Support <ArrowIcon /></a>
              <span className="cta-decoration" aria-hidden="true">O</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-width">
          <div className="footer-main">
            <div className="footer-brand"><Brand inverse /><p>Campus mobility,<br />made simple.</p></div>
            <div className="footer-column"><span>EXPLORE</span><a href="#home">Home</a><a href="#find-bus">Find Bus</a><a href="#routes">Routes</a><a href="#about">About</a></div>
            <div className="footer-column"><span>SUPPORT</span><a href="#faq">FAQ</a><a href="#contact">Contact</a><a href="#support-options">Report Issue</a></div>
            <a className="back-top" href="#home" aria-label="Back to top"><ArrowIcon diagonal /></a>
          </div>
          <div className="footer-bottom"><span>© 2026 OCT RIDE. Made for Oriental College of Technology.</span><span>BHOPAL, INDIA <i /> CAMPUS MOBILITY</span></div>
        </div>
      </footer>
    </div>
  );
}

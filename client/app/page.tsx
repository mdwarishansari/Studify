"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const features = [
  { icon: "📋", title: "Notices", desc: "Stay updated with campus announcements in real time." },
  { icon: "📅", title: "Routine", desc: "Manage class timetables organized by campus." },
  { icon: "📁", title: "Resources", desc: "Share and access study materials, PDFs, and notes." },
  { icon: "🔍", title: "Lost & Found", desc: "Report and recover lost items on campus." },
  { icon: "📣", title: "Complaints", desc: "Submit and track issues with full transparency." },
  { icon: "🔔", title: "Alerts", desc: "Real-time notifications for what matters to you." },
];

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="page-container">
      <div className="mesh-bg" />

      <div className="content-wrapper">
        {/* NAV */}
        <nav className="navbar">
          <span className="logo-text">
            ✦ Studify
          </span>
          <div className="nav-actions">
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard" className="btn-primary btn-sm">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-section">
          <span className="badge hero-badge">
            🎓 Built for campus life
          </span>

          <h1 className="hero-title">
            Manage your campus,<br />effortlessly.
          </h1>

          <p className="hero-desc">
            Notices, routines, resources, complaints, and more — all in one
            platform built for students, teachers, and admins.
          </p>

          <div className="hero-actions">
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard" className="btn-primary">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/sign-up" className="btn-primary">
                  Get started for free
                </Link>
                <Link href="/sign-in" className="btn-secondary">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="footer">
          © 2025 Studify · Built with ♡
        </footer>
      </div>
    </div>
  );
}

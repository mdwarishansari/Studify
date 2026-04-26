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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div className="mesh-bg" />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* NAV */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 40px", borderBottom: "1px solid var(--border)",
          background: "rgba(15,15,19,0.8)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <span style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            ✦ Studify
          </span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard" className="btn-primary" style={{ padding: "9px 22px", fontSize: "0.875rem" }}>
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="btn-secondary" style={{ padding: "9px 22px", fontSize: "0.875rem" }}>
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-primary" style={{ padding: "9px 22px", fontSize: "0.875rem" }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "96px 24px 80px",
        }}>
          <span className="badge" style={{ marginBottom: 24 }}>
            🎓 Built for campus life
          </span>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            maxWidth: 700,
            background: "linear-gradient(135deg, #f0f0f8 0%, #9090b0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 24,
          }}>
            Manage your campus,<br />effortlessly.
          </h1>

          <p style={{
            fontSize: "1.15rem", color: "var(--text-secondary)",
            maxWidth: 520, lineHeight: 1.7, marginBottom: 40,
          }}>
            Notices, routines, resources, complaints, and more — all in one
            platform built for students, teachers, and admins.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
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
        <section style={{
          maxWidth: 1000, margin: "0 auto", padding: "0 24px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>{f.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{
          textAlign: "center", padding: "24px",
          borderTop: "1px solid var(--border)",
          color: "var(--text-secondary)", fontSize: "0.85rem",
        }}>
          © 2025 Studify · Built with ♡
        </footer>
      </div>
    </div>
  );
}

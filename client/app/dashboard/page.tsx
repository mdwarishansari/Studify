"use client";

import { useUser, useAuth, SignOutButton, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface MongoUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const init = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Sync user with backend (creates DB record if needed)
        await fetch(`${API}/users/sync`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch MongoDB profile
        const res = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setMongoUser(json.data);
      } catch (err) {
        console.error("[dashboard]", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isLoaded, isSignedIn, getToken]);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) return <RedirectToSignIn />;

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          color: "var(--text-secondary)",
        }}>
          <div style={{
            width: 40, height: 40, border: "3px solid var(--border)",
            borderTopColor: "var(--accent)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: "0.9rem" }}>Loading your workspace…</span>
        </div>
      </div>
    );
  }

  const displayUser = mongoUser ?? {
    _id: clerkUser?.id ?? "",
    name: clerkUser?.fullName ?? "User",
    email: clerkUser?.primaryEmailAddress?.emailAddress ?? "",
    image: clerkUser?.imageUrl ?? "",
    createdAt: new Date().toISOString(),
  };

  const initials = displayUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    { label: "Notices", value: "—", icon: "📋" },
    { label: "Campuses", value: "—", icon: "🏫" },
    { label: "Resources", value: "—", icon: "📁" },
    { label: "Complaints", value: "—", icon: "📣" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative" }}>
      <div className="mesh-bg" />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* TOP NAV */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 32px",
          background: "rgba(15,15,19,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
            ✦ Studify
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.85rem", color: "#fff",
              overflow: "hidden",
            }}>
              {displayUser.image
                ? <img src={displayUser.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : initials}
            </div>

            <SignOutButton redirectUrl="/">
              <button style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.85rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
                  (e.target as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.target as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
              >
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </header>

        {/* MAIN */}
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          {/* Welcome banner */}
          <div className="glass" style={{ padding: "28px 32px", marginBottom: 32 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 6 }}>
              Welcome back 👋
            </p>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
              {displayUser.name}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {displayUser.email}
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16, marginBottom: 32,
          }}>
            {stats.map((s) => (
              <div key={s.label} className="glass" style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Account details */}
          <div className="glass" style={{ padding: "28px 32px" }}>
            <h2 style={{ fontWeight: 700, marginBottom: 20, color: "var(--text-primary)", fontSize: "1rem" }}>
              Account Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "MongoDB ID", value: displayUser._id || "—", mono: true },
                { label: "Clerk ID", value: clerkUser?.id ?? "—", mono: true },
                { label: "Member since", value: new Date(displayUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid var(--border)",
                }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{
                    fontSize: mono ? "0.75rem" : "0.875rem",
                    fontFamily: mono ? "monospace" : "inherit",
                    color: "var(--text-primary)",
                    maxWidth: "60%", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                    textAlign: "right",
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}


"use client";

import { useUser, useAuth, SignOutButton, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSyncUser } from "@/hooks/useSyncUser";
import { getMyProfile } from "@/lib/api";

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
  const { synced } = useSyncUser();
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !synced) return;

    const init = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const json = await getMyProfile(token);
        if (json.success) setMongoUser(json.data);
      } catch (err) {
        console.error("[dashboard]", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isLoaded, isSignedIn, synced, getToken]);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) return <RedirectToSignIn />;

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="auth-container">
        <div className="flex flex-col items-center gap-4 text-[var(--text-secondary)]">
          <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
          <span className="text-sm">Loading your workspace…</span>
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
    <div className="page-container">
      <div className="mesh-bg" />

      <div className="content-wrapper">
        {/* TOP NAV */}
        <header className="dashboard-header">
          <span className="text-[1.2rem] font-bold text-[var(--text-primary)] tracking-tight">
            ✦ Studify
          </span>

          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="dashboard-avatar">
              {displayUser.image
                ? <img src={displayUser.image} alt="" className="w-full h-full object-cover" />
                : initials}
            </div>

            <SignOutButton redirectUrl="/">
              <button className="btn-secondary py-2 px-4 text-sm rounded-lg hover:text-[var(--text-primary)] hover:border-white/20">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </header>

        {/* MAIN */}
        <main className="dashboard-main">

          {/* Welcome banner */}
          <div className="glass dashboard-welcome">
            <p className="text-[var(--text-secondary)] text-sm mb-1.5">
              Welcome back 👋
            </p>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
              {displayUser.name}
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              {displayUser.email}
            </p>
          </div>

          {/* Stats */}
          <div className="dashboard-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="glass dashboard-stat-card">
                <div className="text-2xl mb-2.5">{s.icon}</div>
                <div className="text-[1.6rem] font-bold text-[var(--text-primary)]">{s.value}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Account details */}
          <div className="glass dashboard-account">
            <h2 className="font-bold mb-5 text-[var(--text-primary)] text-base">
              Account Details
            </h2>
            <div className="flex flex-col gap-3.5">
              {[
                { label: "MongoDB ID", value: displayUser._id || "—", mono: true },
                { label: "Clerk ID", value: clerkUser?.id ?? "—", mono: true },
                { label: "Member since", value: new Date(displayUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label} className="dashboard-account-row">
                  <span className="text-sm text-[var(--text-secondary)]">{label}</span>
                  <span className={`text-${mono ? "xs" : "sm"} ${mono ? "font-mono" : "font-sans"} text-[var(--text-primary)] max-w-[60%] overflow-hidden text-ellipsis whitespace-nowrap text-right`}>
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


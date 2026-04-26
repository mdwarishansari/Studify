"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { syncUserWithBackend } from "@/lib/api";

/**
 * useSyncUser
 * Automatically syncs the Clerk session with MongoDB on every login.
 * Call this once inside your app shell / dashboard layout.
 */
export function useSyncUser() {
  const { getToken, isSignedIn } = useAuth();
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || synced) return;

    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        await syncUserWithBackend(token);
        setSynced(true);
      } catch (err) {
        console.error("[useSyncUser]", err);
        setError("Failed to sync user with server.");
      }
    })();
  }, [isSignedIn, synced, getToken]);

  return { synced, error };
}

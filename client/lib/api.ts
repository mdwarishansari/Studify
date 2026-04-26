const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * syncUserWithBackend
 * Call this on every sign-in to ensure the user exists in MongoDB.
 * Pass the Clerk token retrieved from `getToken()`.
 */
export async function syncUserWithBackend(token: string) {
  const res = await fetch(`${API_BASE}/users/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Sync failed: ${res.status}`);
  }

  return res.json();
}

/**
 * getMyProfile
 * Fetch the logged-in user's MongoDB profile.
 */
export async function getMyProfile(token: string) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  return res.json();
}

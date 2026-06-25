function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function createGuestSession() {
  return {
    mode: "guest",
    token: null,
    user: {
      id: "guest",
      email: "",
      displayName: "Guest",
      role: "guest",
    },
  };
}

export function createPlaceholderSession({ email, mode }) {
  const normalizedEmail = normalizeString(email).toLowerCase();

  return {
    mode,
    token: `placeholder-token-${Date.now()}`,
    user: {
      id: `placeholder-${normalizedEmail || "user"}`,
      email: normalizedEmail,
      displayName: normalizedEmail || "ArchIvory User",
      role: "member",
    },
  };
}

export function normalizeAuthSession(payload, mode) {
  const user = payload?.user || {};
  const normalizedEmail = normalizeString(user.email);

  return {
    mode,
    token: normalizeString(payload?.token) || null,
    user: {
      id: normalizeString(user.id) || "",
      email: normalizedEmail,
      displayName:
        normalizeString(user.displayName) || normalizedEmail || "ArchIvory User",
      role: normalizeString(user.role) || "member",
    },
  };
}

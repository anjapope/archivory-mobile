import {
  createGuestSession,
  createPlaceholderSession,
  normalizeAuthSession,
} from "../types/account";

const DEFAULT_AUTH_URL = "https://please-configure-api-url.invalid/api/auth";

export const AUTH_API_URL =
  process.env.EXPO_PUBLIC_ARCHIVORY_AUTH_API_URL || DEFAULT_AUTH_URL;

function normalizeTextValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateApiUrl(apiUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    throw new Error("invalid-auth-api-url-format");
  }

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    !parsedUrl.hostname ||
    parsedUrl.pathname === "/"
  ) {
    throw new Error("invalid-auth-api-url");
  }

  return parsedUrl;
}

function isPlaceholderApiUrl(apiUrl) {
  return (
    apiUrl.protocol === "https:" &&
    apiUrl.hostname === "please-configure-api-url.invalid" &&
    apiUrl.pathname === "/api/auth"
  );
}

function createCredentialsPayload({ email, password }) {
  return {
    email: normalizeTextValue(email).toLowerCase(),
    password: normalizeTextValue(password),
    source: "mobile-app",
  };
}

async function postAuthAction(endpoint, payload, mode) {
  const resolvedApiUrl = validateApiUrl(AUTH_API_URL);

  if (isPlaceholderApiUrl(resolvedApiUrl)) {
    return {
      session: createPlaceholderSession({ email: payload.email, mode }),
      mode: "placeholder",
    };
  }

  const response = await fetch(new URL(endpoint, resolvedApiUrl).toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    session: normalizeAuthSession(data, mode),
    mode: "live",
  };
}

export async function signIn({ email, password }) {
  const payload = createCredentialsPayload({ email, password });

  if (!payload.email || !payload.password) {
    throw new Error("missing-credentials");
  }

  return postAuthAction("login", payload, "login");
}

export async function signUp({ email, password }) {
  const payload = createCredentialsPayload({ email, password });

  if (!payload.email || !payload.password) {
    throw new Error("missing-credentials");
  }

  return postAuthAction("register", payload, "signup");
}

export function continueAsGuest() {
  return {
    session: createGuestSession(),
    mode: "placeholder",
  };
}

import {
  createPlaceholderResult,
  normalizeSubmissionResult,
} from "../types/submission";

const DEFAULT_API_URL = "https://please-configure-api-url.invalid/api/submissions";
const DEFAULT_GAME_API_URL =
  "https://please-configure-api-url.invalid/api/game-submissions";

export const API_URL =
  process.env.EXPO_PUBLIC_ARCHIVORY_API_URL || DEFAULT_API_URL;
export const GAME_API_URL =
  process.env.EXPO_PUBLIC_ARCHIVORY_GAME_API_URL || DEFAULT_GAME_API_URL;

function normalizeTextValue(value) {
  return typeof value === "string" ? value : "";
}

function validateApiUrl(apiUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    throw new Error("invalid-api-url-format");
  }

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    !parsedUrl.hostname ||
    parsedUrl.pathname === "/"
  ) {
    throw new Error("invalid-api-url");
  }

  return parsedUrl;
}

function isPlaceholderApiUrl(apiUrl) {
  return (
    apiUrl.protocol === "https:" &&
    apiUrl.hostname === "please-configure-api-url.invalid" &&
    apiUrl.pathname === "/api/submissions"
  );
}

function isPlaceholderGameApiUrl(apiUrl) {
  return (
    apiUrl.protocol === "https:" &&
    apiUrl.hostname === "please-configure-api-url.invalid" &&
    apiUrl.pathname === "/api/game-submissions"
  );
}

function createFormData({ photoUri, notes, objectLocation }) {
  const formData = new FormData();

  formData.append("image", {
    uri: photoUri,
    name: "archivory-submission.jpg",
    type: "image/jpeg",
  });
  formData.append("notes", normalizeTextValue(notes));
  formData.append("objectLocation", normalizeTextValue(objectLocation));
  formData.append("source", "mobile-app");
  formData.append("gameMode", "evidence-submission");

  return formData;
}

export async function submitEvidence({ photoUri, notes, objectLocation }) {
  const resolvedApiUrl = validateApiUrl(API_URL);

  if (isPlaceholderApiUrl(resolvedApiUrl)) {
    return {
      result: createPlaceholderResult({ notes, objectLocation }),
      mode: "placeholder",
    };
  }

  const response = await fetch(resolvedApiUrl.toString(), {
    method: "POST",
    body: createFormData({ photoUri, notes, objectLocation }),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    result: normalizeSubmissionResult(data),
    mode: "live",
  };
}

function createGameSubmissionPayload({ result, authSession }) {
  return {
    source: "mobile-app",
    game: "interactive-digital-exhibition",
    userId: authSession?.user?.id || "",
    userEmail: authSession?.user?.email || "",
    artifact: {
      material: normalizeTextValue(result?.predictedMaterial),
      objectType: normalizeTextValue(result?.objectType),
      confidence: normalizeTextValue(result?.confidence),
      pointsAwarded:
        typeof result?.pointsAwarded === "number" ? result.pointsAwarded : 0,
      summary: normalizeTextValue(result?.summary),
    },
  };
}

function createGameSubmissionFormData({ result, authSession, photoUri }) {
  const formData = new FormData();
  const payload = createGameSubmissionPayload({ result, authSession });

  if (photoUri) {
    formData.append("image", {
      uri: photoUri,
      name: "archivory-game-submission.jpg",
      type: "image/jpeg",
    });
  }

  formData.append("source", payload.source);
  formData.append("game", payload.game);
  formData.append("userId", payload.userId);
  formData.append("userEmail", payload.userEmail);
  formData.append("artifactMaterial", payload.artifact.material);
  formData.append("artifactObjectType", payload.artifact.objectType);
  formData.append("artifactConfidence", payload.artifact.confidence);
  formData.append(
    "artifactPointsAwarded",
    String(payload.artifact.pointsAwarded)
  );
  formData.append("artifactSummary", payload.artifact.summary);

  return formData;
}

export async function submitResultToInteractiveGame({ result, photoUri, authSession }) {
  const resolvedGameApiUrl = validateApiUrl(GAME_API_URL);

  if (isPlaceholderGameApiUrl(resolvedGameApiUrl)) {
    return {
      mode: "placeholder",
      status: "queued",
      message:
        "Placeholder game submission saved. Connect EXPO_PUBLIC_ARCHIVORY_GAME_API_URL for live game sync.",
    };
  }

  const response = await fetch(resolvedGameApiUrl.toString(), {
    method: "POST",
    body: createGameSubmissionFormData({
      result,
      photoUri,
      authSession,
    }),
  });

  if (!response.ok) {
    throw new Error(`Game submission failed with status ${response.status}`);
  }

  return {
    mode: "live",
    status: "submitted",
    message:
      "Artifact result submitted to Interactive Digital Exhibition Game.",
  };
}

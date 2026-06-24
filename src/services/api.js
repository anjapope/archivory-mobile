import {
  createPlaceholderResult,
  normalizeSubmissionResult,
} from "../types/submission";

const DEFAULT_API_URL = "https://please-configure-api-url.invalid/api/submissions";

export const API_URL =
  process.env.EXPO_PUBLIC_ARCHIVORY_API_URL || DEFAULT_API_URL;

function isPlaceholderApiUrl(apiUrl) {
  try {
    const parsedUrl = new URL(apiUrl);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "please-configure-api-url.invalid" &&
      parsedUrl.pathname === "/api/submissions"
    );
  } catch {
    return apiUrl === DEFAULT_API_URL;
  }
}

function createFormData({ photoUri, notes, objectLocation }) {
  const formData = new FormData();

  formData.append("image", {
    uri: photoUri,
    name: "archivory-submission.jpg",
    type: "image/jpeg",
  });
  formData.append("notes", notes);
  formData.append("objectLocation", objectLocation);
  formData.append("source", "mobile-app");
  formData.append("gameMode", "evidence-submission");

  return formData;
}

export async function submitEvidence({ photoUri, notes, objectLocation }) {
  if (isPlaceholderApiUrl(API_URL)) {
    return {
      result: createPlaceholderResult({ notes, objectLocation }),
      mode: "placeholder",
    };
  }

  const response = await fetch(API_URL, {
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

import {
  createPlaceholderResult,
  normalizeSubmissionResult,
} from "../types/submission";

export const API_URL = "https://your-render-app.onrender.com/api/submissions";

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
  if (API_URL.includes("your-render-app.onrender.com")) {
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

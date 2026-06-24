const BASE_EVIDENCE_POINTS = 10;
const BONUS_EVIDENCE_POINTS = 25;

export function createPlaceholderResult({ notes, objectLocation }) {
  const notesProvided = notes.trim().length > 0;

  return {
    predictedMaterial: "Awaiting AI backend",
    objectType: objectLocation ? "Field submission" : "Unclassified artifact",
    confidence: "placeholder",
    pointsAwarded: notesProvided
      ? BONUS_EVIDENCE_POINTS
      : BASE_EVIDENCE_POINTS,
    summary:
      notesProvided
        ? notes.trim()
        : "Add a backend URL to replace this placeholder result.",
  };
}

export function normalizeSubmissionResult(result) {
  return {
    predictedMaterial:
      result?.predictedMaterial || "Awaiting AI backend",
    objectType: result?.objectType || "Unclassified artifact",
    confidence: result?.confidence || "placeholder",
    pointsAwarded:
      typeof result?.pointsAwarded === "number" ? result.pointsAwarded : 0,
    summary:
      result?.summary ||
      result?.notesSummary ||
      "The backend did not return a summary for this artifact.",
  };
}

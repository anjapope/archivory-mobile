export function createPlaceholderResult({ notes, objectLocation }) {
  return {
    predictedMaterial: "Awaiting AI backend",
    objectType: objectLocation ? "Field submission" : "Unclassified artifact",
    confidence: "placeholder",
    pointsAwarded: notes.trim() ? 25 : 10,
    summary:
      notes.trim() || "Add a backend URL to replace this placeholder result.",
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

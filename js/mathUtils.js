export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function dotProduct(vectorA, vectorB) {
  return vectorA.reduce((sum, value, index) => {
    return sum + value * vectorB[index];
  }, 0);
}

export function vectorNorm(vector) {
  return Math.sqrt(
    vector.reduce((sum, value) => {
      return sum + value * value;
    }, 0)
  );
}

export function cosineSimilarity(vectorA, vectorB) {
  const normA = vectorNorm(vectorA);
  const normB = vectorNorm(vectorB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct(vectorA, vectorB) / (normA * normB);
}

export function average(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  const total = numbers.reduce((sum, value) => sum + value, 0);

  return total / numbers.length;
}

export function cosineDistance(vectorA, vectorB) {
  return 1 - cosineSimilarity(vectorA, vectorB);
}
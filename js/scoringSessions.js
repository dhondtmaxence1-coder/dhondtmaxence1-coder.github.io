import { MOOD_KEYS, APP_CONFIG } from "./constants.js";
import { average, clamp, cosineDistance } from "./mathUtils.js";

export function scoreSessions(sessions, userTarget) {
  return sessions
    .map((session) => {
      const scoringDetails = computeRawSessionMetrics(session, userTarget);

      return {
        ...session,
        sessionScore: computeFinalSessionScore(scoringDetails),
        scoringDetails
      };
    })
    .sort((a, b) => b.sessionScore - a.sessionScore);
}

export function computeRawSessionMetrics(session, userTarget) {
  const averageMoodDistance = computeAverageMoodDistance(session);

  return {
    averageFilmScore: computeAverageFilmScore(session),
    durationScore: computeDurationScore(
      session.totalDuration,
      userTarget.availableTime
    ),
    similarityScore: computeSimilarityBalanceScore(
      averageMoodDistance,
      APP_CONFIG.targetDistance
    ),
    intensityVariationScore: computeIntensityVariationScore(session),
    openingBonus: computeOpeningBonus(session, userTarget.availableTime),
    endingBonus: computeEndingBonus(session)
  };
}

export function computeAverageFilmScore(session) {
  return average(
    session.films.map((film) => film.individualFilmScore)
  );
}

export function computeDurationScore(totalDuration, availableTime) {
  const gap = Math.abs(totalDuration - availableTime);
  const relativeGap = gap / availableTime;
  const absolutePenalty = gap / availableTime;

  return clamp(1 - relativeGap - absolutePenalty, 0, 1);
}

export function computeAverageMoodDistance(session) {
  const distances = [];

  for (let i = 0; i < session.films.length; i += 1) {
    for (let j = i + 1; j < session.films.length; j += 1) {
      const vectorA = moodObjectToVector(session.films[i].moodVector);
      const vectorB = moodObjectToVector(session.films[j].moodVector);

      distances.push(cosineDistance(vectorA, vectorB));
    }
  }

  return average(distances);
}

export function computeSimilarityBalanceScore(distance, targetDistance) {
  return clamp(
    1 - Math.abs(distance - targetDistance) / targetDistance,
    0,
    1
  );
}

export function computeIntensityVariationScore(session) {
  const intensities = session.films.map((film) => film.intensity);

  return Math.max(...intensities) - Math.min(...intensities);
}

export function computeOpeningBonus(session, availableTime) {
  const firstFilm = session.films[0];

  return firstFilm.durationMinutes < availableTime * 0.33 ? 1 : 0;
}

export function computeEndingBonus(session) {
  const lastFilm = session.films[session.films.length - 1];

  return lastFilm.endingMentioned === 1 ? 1 : 0;
}

export function computeFinalSessionScore(metrics) {
  return (
    0.25 * metrics.averageFilmScore +
    0.25 * metrics.durationScore +
    0.20 * metrics.similarityScore +
    0.10 * metrics.intensityVariationScore +
    0.10 * metrics.openingBonus +
    0.10 * metrics.endingBonus
  );
}

function moodObjectToVector(moodVector) {
  return MOOD_KEYS.map((moodKey) => moodVector[moodKey]);
}
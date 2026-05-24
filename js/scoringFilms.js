import { MOOD_KEYS } from "./constants.js";
import { clamp, cosineSimilarity } from "./mathUtils.js";

export function scoreFilms(films, userTarget) {
  return films
    .map((film) => {
      const scoringDetails = computeFilmScoringDetails(film, userTarget);

      return {
        ...film,
        individualFilmScore: computeIndividualFilmScore(scoringDetails),
        scoringDetails
      };
    })
    .sort((a, b) => b.individualFilmScore - a.individualFilmScore);
}

export function computeFilmScoringDetails(film, userTarget) {
  return {
    moodMatch: computeMoodMatch(film.moodVector, userTarget.moodVector),
    intensityFit: computeIntensityFit(film.intensity, userTarget.intensity),
    durationFit: computeDurationFit(
      film.durationMinutes,
      userTarget.availableTime
    )
  };
}

export function computeIndividualFilmScore(scoringDetails) {
  return (
    0.55 * scoringDetails.moodMatch +
    0.30 * scoringDetails.intensityFit +
    0.15 * scoringDetails.durationFit
  );
}

export function computeMoodMatch(filmMoodVector, userMoodVector) {
  const filmVector = MOOD_KEYS.map((moodKey) => filmMoodVector[moodKey]);
  const userVector = MOOD_KEYS.map((moodKey) => userMoodVector[moodKey]);

  return clamp(cosineSimilarity(filmVector, userVector), 0, 1);
}

export function computeIntensityFit(filmIntensity, userIntensity) {
  return clamp(1 - Math.abs(userIntensity - filmIntensity), 0, 1);
}

export function computeDurationFit(filmDuration, availableTime) {
  const ratio = filmDuration / availableTime;

  if (ratio <= 1) {
    return clamp(Math.sqrt(ratio), 0, 1);
  }

  return clamp(1 - 2 * (ratio - 1), 0, 1);
}

export function getTopFilms(scoredFilms, count) {
  return scoredFilms.slice(0, count);
}
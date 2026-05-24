import { MOOD_KEYS } from "./constants.js";

function resolveMode(mode) {
  if (mode !== "surprise") {
    return mode;
  }

  return Math.random() < 0.5 ? "single" : "session";
}

export function createInitialUserTarget(userInputs) {
    const moodVector = {};

    MOOD_KEYS.forEach((moodKey) => {
        moodVector[moodKey] = moodKey === userInputs.selectedMood ? 1 : 0;
    });

    return {
        moodVector,
        intensity: 0.5,
        availableTime: userInputs.availableTime,
        mode: userInputs.mode,
        resolvedMode: resolveMode(userInputs.mode)
    };
}

export function selectCalibrationFilms(films, count) {
    const shuffledFilms = [...films].sort(() => Math.random() - 0.5);

    return shuffledFilms.slice(0, count);
}

export function updateUserTargetWithChoice(userTarget, film, choice) {
    const direction = choice === "take" ? 1 : -1;
    const step = choice === "take" ? 0.25 : -0.15;

    const updatedMoodVector = {};

    MOOD_KEYS.forEach((moodKey) => {
    const currentValue = userTarget.moodVector[moodKey];
    const filmValue = film.moodVector[moodKey];

    updatedMoodVector[moodKey] = clamp(
        currentValue + step * (filmValue - currentValue),
        0,
        1
    );
    })

    const updatedIntensity = clamp(
        userTarget.intensity + step * (film.intensity - userTarget.intensity),
        0,
        1
    );

    return {
        ...userTarget,
        moodVector: updatedMoodVector,
        intensity: updatedIntensity
    };
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
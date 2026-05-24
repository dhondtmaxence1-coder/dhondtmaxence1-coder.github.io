import { MOOD_KEYS } from "./constants.js";

export async function loadFilms() {
  const response = await fetch("./data/films_enriched.json");

  if (!response.ok) {
    throw new Error(`Impossible de charger les films : ${response.status}`);
  }

  const films = await response.json();
  validateFilms(films);

  return films;
}

export function validateFilms(films) {
  if (!Array.isArray(films)) {
    throw new Error("films_enriched.json doit contenir un tableau de films.");
  }

  films.forEach((film, index) => {
    validateRequiredField(film, "id", index);
    validateRequiredField(film, "title", index);
    validateRequiredField(film, "url", index);
    validateRequiredField(film, "thumbnail", index);
    validateRequiredField(film, "durationMinutes", index);
    validateRequiredField(film, "genres", index);
    validateRequiredField(film, "moodVector", index);
    validateRequiredField(film, "themes", index);
    validateRequiredField(film, "intensity", index);
    validateRequiredField(film, "endingMentioned", index);
    validateRequiredField(film, "choiceLine", index);

    if (typeof film.durationMinutes !== "number") {
      throw new Error(`Film ${index}: durationMinutes doit être un nombre.`);
    }

    if (typeof film.intensity !== "number") {
      throw new Error(`Film ${index}: intensity doit être un nombre.`);
    }

    MOOD_KEYS.forEach((moodKey) => {
      if (typeof film.moodVector[moodKey] !== "number") {
        throw new Error(
          `Film ${index}: moodVector.${moodKey} est manquant ou invalide.`
        );
      }
    });
  });

  return true;
}

function validateRequiredField(film, fieldName, index) {
  if (film[fieldName] === undefined || film[fieldName] === null) {
    throw new Error(`Film ${index}: champ manquant "${fieldName}".`);
  }
}
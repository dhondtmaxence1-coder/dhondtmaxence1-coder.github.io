export function getFinalPool(scoredSessions, ratio) {
  const poolSize = Math.max(1, Math.ceil(scoredSessions.length * ratio));

  return scoredSessions.slice(0, poolSize);
}

export function computeSessionWeight(session) {
  return session.sessionScore ** 3;
}

export function weightedDraw(pool, count, excludedSessionIds = []) {
  const excludedSet = new Set(excludedSessionIds);
  const availablePool = pool.filter((session) => {
    return !excludedSet.has(session.id);
  });

  const results = [];
  const remainingPool = [...availablePool];

  while (results.length < count && remainingPool.length > 0) {
    const selectedSession = pickOneWeighted(remainingPool);

    results.push(selectedSession);

    const selectedIndex = remainingPool.findIndex((session) => {
      return session.id === selectedSession.id;
    });

    remainingPool.splice(selectedIndex, 1);
  }

  return results;
}

export function pickOneWeighted(pool) {
  const totalWeight = pool.reduce((sum, session) => {
    return sum + computeSessionWeight(session);
  }, 0);

  if (totalWeight === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let randomThreshold = Math.random() * totalWeight;

  for (const session of pool) {
    randomThreshold -= computeSessionWeight(session);

    if (randomThreshold <= 0) {
      return session;
    }
  }

  return pool[pool.length - 1];
}

export function rerollResults(finalPool, currentResults, count) {
  const currentResultIds = currentResults.map((session) => session.id);

  return weightedDraw(finalPool, count, currentResultIds);
}

export function selectSingleFilmResults(scoredFilms, count) {
  return scoredFilms.slice(0, count).map((film, index) => {
    return {
      id: `single_${film.id}_${index + 1}`,
      films: [film],
      totalDuration: film.durationMinutes,
      sessionScore: film.individualFilmScore,
      scoringDetails: film.scoringDetails
    };
  });
}
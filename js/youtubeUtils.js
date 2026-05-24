export function getYoutubeIdFromUrl(url) {
  const parsedUrl = new URL(url);

  if (parsedUrl.hostname.includes("youtube.com")) {
    return parsedUrl.searchParams.get("v");
  }

  if (parsedUrl.hostname.includes("youtu.be")) {
    return parsedUrl.pathname.slice(1);
  }

  return null;
}

export function getYoutubeEmbedUrl(film) {
  const youtubeId = getYoutubeIdFromUrl(film.url);

  if (!youtubeId) {
    return null;
  }

  return `https://www.youtube.com/embed/${youtubeId}`;
}

export function getYoutubeWatchUrl(film) {
  const youtubeId = getYoutubeIdFromUrl(film.url);

  if (!youtubeId) {
    return film.url;
  }

  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
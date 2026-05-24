# Lens

**Short films, brought into focus.**

Lens is a mobile-first web app that turns a user's available time and mood into curated short film recommendations.

## Problem

Short films are widely available online, but they are difficult to discover intentionally. Users often scroll through platforms without knowing what to watch, especially when they only have a limited amount of time.

Meanwhile, independent filmmakers and short film creators struggle to get visibility on platforms that often prioritize fast, easily repeatable entertainment formats over more intentional cinematic work.

Lens is where the two sides meet: a lightweight curation layer over existing YouTube short films, helping viewers find meaningful short-form cinema while giving artistic short films a better chance to be discovered.

## Core idea

The user provides:

- available time;
- mood;
- preferred mode: one film, mini-session, or surprise.

Lens then asks a few quick Take / Skip calibration questions and builds either:

- a single short film recommendation;
- or a mini-session of 2 to 3 short films.

## Technical pipeline

1. Load enriched short film data from `films_enriched.json`.
2. Create an initial user profile from mood, time and mode.
3. Calibrate the profile with Take / Skip cards.
4. Score each film individually.
5. Keep the best candidate films.
6. Generate possible sessions of 2 or 3 films.
7. Score each session based on:
   - film relevance;
   - duration fit;
   - similarity balance;
   - intensity variation;
   - opening bonus;
   - ending bonus.
8. Keep the top 5% sessions.
9. Draw 3 recommendations using weighted randomness.
10. Allow reroll without recalculating the full pipeline.

## Features

- Mobile-first interface
- PWA-ready structure
- YouTube embeds
- Single film mode
- Mini-session mode
- Surprise mode
- Take / Skip calibration
- Weighted recommendation reroll
- GitHub Pages compatible

## Tech stack

- HTML
- CSS
- Vanilla JavaScript modules
- Static JSON data
- GitHub Pages
- Progressive Web App manifest and service worker

## Data

The current version uses an already generated `films_enriched.json` file for demo purposes.

The intended production pipeline is:

YouTube search → raw_youtube_results.json → AI enrichment → films_enriched.json → Lens front-end

The front-end does not call YouTube or AI APIs during runtime.

## Run locally

Open the project with Live Server in VSCode.

Main entry point:

`index.html`

## Deployment

The app is designed to be deployed as a static site on GitHub Pages.

All paths are relative to support deployment under a GitHub Pages repository path.

## Limitations

- YouTube embeds may depend on video owner settings.
- The enrichment pipeline is not executed live in the front-end.
- Swipe interactions are basic and may vary by device.

## Future improvements

- Larger dataset
- Better swipe animations
- Offline-friendly recommendation mode
- More advanced session diversity scoring
- Support for accounts and history
- Language selection
- Accessibility toggles, i.e. only allow subtitled videos
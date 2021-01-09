# Lunchable Monorepository

[![Netlify Status](https://api.netlify.com/api/v1/badges/941e06fb-c043-4327-a6f9-acd67804bc74/deploy-status)](https://app.netlify.com/sites/lunchable/deploys)
[![Heroku](https://heroku-badge.herokuapp.com/?app=lunchable-api)]

Monorepository codebase for Lunchable.

**Folders:**

- `server/`: the backend web server.
- `web/`: the main web client.
- `extension/`: the Chrome extension.

**Getting Started:**

- Create `.env.development` in `config/`, see Notion doc for API keys.
- `yarn install`: install dev dependencies in root.
- `yarn setup`: installing dependencies in all three folders.
- `yarn dev`: runs the development server with hot reloading.

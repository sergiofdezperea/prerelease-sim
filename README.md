# prerealease-sim

A frontend web application built with React and Vite.

This will simulate opening pack for selected expansion of OPTCG with the west content.

This repository contains the source code and configuration required to develop, build, and deploy the application.

## Prerequisites

To work with this project locally, ensure you have the following installed:

* Node.js version 18 or later (npm is included with Node.js)
* Git

## Installation

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/sergiofdezperea/prerelease-sim.git
cd prerealease-sim
npm install
```

## Development

Run the development server with hot module replacement:

```bash
npm run dev
```

## Build

Generate an optimized production build:

```bash
npm run build
```

## Preview

Serve the production build locally for preview purposes:

```bash
npm run preview
```

## Deployment

The application is automatically built and deployed using GitHub Actions. The deployment workflow runs on pushes to the configured branch and produces a production-ready build.

## Notes

* The `node_modules` directory is intentionally excluded from version control and must be installed locally using `npm install`.
* Ensure you are using a compatible Node.js version before installing dependencies or running build commands.

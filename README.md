# Trackly — Job Application Tracker

A responsive React app for organizing a job search. Add applications, find them with search and status filters, update progress, and remove old entries. Applications are saved in the browser using localStorage.

**Live demo:** https://job-tracker-umber-five.vercel.app

**Source code:** https://github.com/fardeemkhan0614/job-tracker

**Clone:** `git clone https://github.com/fardeemkhan0614/job-tracker.git`

## Features

- Add a job title, company, application date, and current status
- Search by company or job title
- Filter applications by status
- Update an application's status from its card
- Delete applications
- Summary cards for applications, interviews, offers, and responses
- Responsive layout for desktop and mobile
- Direct GitHub source-code link in the app header
- Save data locally in the current browser

## Built with

- React
- JavaScript (ES6+)
- CSS
- Vite
- Browser localStorage

## Run locally

Install [Node.js](https://nodejs.org/) first, then run:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Create a production build

```bash
npm run build
```

The production files are created in the `dist` folder. The project can be deployed to a static hosting provider such as Vercel, Netlify, or GitHub Pages.

## Data note

Applications are stored in the browser on the current device. They are not synced to an account or shared across devices.


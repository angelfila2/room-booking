# room-booking

A backend-focused **room booking system** built with **Node.js**, **Express**, and **React**, currently using in-memory sample data.
This project demonstrates real-world backend concepts such as **RESTful API design**, **business rule enforcement**, **conflict detection**, and **clean architecture**.

## Why I Created This

This project was inspired by a real pain point I experienced at my previous job. We were unable to use existing scheduling tools such as **Microsoft Outlook** for room bookings, and instead relied on a shared **Excel spreadsheet** to manage room reservations.

Using a spreadsheet for scheduling introduced several issues:

- No built-in **conflict or double-booking detection**
- High risk of **overlapping bookings**
- Easy to miss reservations due to the lack of structured views (e.g. daily or weekly views)
- Manual coordination whenever changes were made, leading to frequent service disruptions

As the number of bookings grew, these limitations became increasingly problematic and caused avoidable scheduling conflicts.

I built this room booking system to address those exact problems by enforcing booking rules at the backend level, preventing overlapping reservations, and providing a structured way to view room availability. The current prototype checks conflicts when creating bookings; edit-time conflict checks remain a follow-up. The goal was to design a backend service that solves a real operational problem rather than a purely theoretical one.

## Tech Stack

### Frontend
- **ReactJS** - Frontend framework for javascript
- **TailwindCSS** - CSS
### Backend
- **Node.js** – JavaScript runtime for building server-side applications
- **Express.js** – Web framework for building RESTful APIs
- **In-memory JavaScript data** – Current booking and user storage; bookings reset when the backend restarts
- **Prisma / PostgreSQL** – Planned persistence, not implemented in this checkout

### Tooling & DevOps
- **Git & GitHub** – Version control and source code management
- **Vite** – Frontend development server and production build


### Architecture & Concepts
- RESTful API design
- Service-layer architecture
- Backend-enforced business rules
- Time-slot conflict detection
- Proper HTTP status codes and error handling


# Future considerations / enhancements

There are a few things about the project that I would like to change or update if I have the time in the future which are:

1. A calendar view / weekly view - in my initial webframe, I had these as alternate UIs as I feel that having a weekly view would make it easier for users to easily digest and understand their workload for the week. However, I eventually decided to put this on hold as I wanted to focus more on the backend with the REST APIs and learning how to use different relational and non-relational databases

2. Swapping from javascript to typescript. While this project uses JavaScript, migrating to TypeScript would have enhanced type safety and developer confidence as the system grows in complexity.



## Running the current prototype

From `backend`, create a local `.env` containing `PORT=3017`, `JWT_SECRET`,
and `JWT_REFRESH_SECRET` (use separate random values for the two secrets), then run:

```powershell
cd backend
npm install
npm start
```

In another terminal:

```powershell
cd roombooking
npm install
npm run dev
```

The frontend's Vite proxy forwards `/api` and `/auth` to the local backend on port
3017. The sample login is `admin` / `password123`; this is a local demo account.
Use the date selector to view the original sample bookings on 22 December 2025.
New dates still show all five rooms even if there are no bookings.

## Light UI polish

The room-card layout and create/edit dialogs are preserved. Updates remove debug
labels, strengthen text contrast, show available/booked badges, allow date browsing,
include all five rooms in the selector, show inline errors, and correct success
notifications. Frontend time-order validation helps prevent accidental invalid entries.
The booking service and in-memory storage have not been rewritten.

## Known prototype limitations

- Booking endpoints do not yet enforce the login token; login alone does not protect them.
- Booking edits do not recheck overlaps. Backend time/date validation also needs strengthening.
- Users, bookings and refresh tokens are in memory, not a persistent database.
- Dependency audit findings and already-tracked backend `node_modules` need a separate cleanup pass.

Screenshots captured during local review use synthetic demo bookings and are stored
in the ignored `.local-preview/screenshots/` folder. They are not evidence of a
production deployment.

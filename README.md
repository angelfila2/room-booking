# room-booking

A backend-focused **room booking system** built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.  
This project demonstrates real-world backend concepts such as **RESTful API design**, **business rule enforcement**, **conflict detection**, and **clean architecture**.

## Why I Created This

This project was inspired by a real pain point I experienced at my previous job. We were unable to use existing scheduling tools such as **Microsoft Outlook** for room bookings, and instead relied on a shared **Excel spreadsheet** to manage room reservations.

Using a spreadsheet for scheduling introduced several issues:

- No built-in **conflict or double-booking detection**
- High risk of **overlapping bookings**
- Easy to miss reservations due to the lack of structured views (e.g. daily or weekly views)
- Manual coordination whenever changes were made, leading to frequent service disruptions

As the number of bookings grew, these limitations became increasingly problematic and caused avoidable scheduling conflicts.

I built this room booking system to address those exact problems by enforcing booking rules at the backend level, preventing overlapping reservations, and providing a structured and reliable way to manage room availability. The goal was to design a backend service that solves a real operational problem rather than a purely theoretical one.

## Tech Stack

### Frontend
- **ReactJS** - Frontend framework for javascript
- **TailwindCSS** - CSS 
### Backend
- **Node.js** – JavaScript runtime for building server-side applications
- **Express.js** – Web framework for building RESTful APIs
- **Prisma ORM** – Type-safe database access and schema management
- **PostgreSQL (Neon)** – Relational database for persistent data storage

### Tooling & DevOps
- **Git & GitHub** – Version control and source code management
- **Prisma Migrate & Seed** – Database migrations and data seeding


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


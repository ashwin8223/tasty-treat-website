# 🍽️ Tasty Treat — Customer Website

A modern, responsive restaurant web application built with **Next.js, React, TypeScript, and Tailwind CSS**.

Tasty Treat is a restaurant platform designed to provide customers with a seamless experience for discovering international cuisines, exploring food menus, placing delivery orders, and reserving tables.

This repository contains the **customer-facing website**. The restaurant administration dashboard is being developed separately.

## 🌍 Project Overview

Tasty Treat is a fictional single-location restaurant offering a selection of international cuisines.

### Cuisines

- 🇺🇸 American
- 🇮🇹 Italian
- 🇲🇽 Mexican
- 🇯🇵 Japanese
- 🇮🇳 Indian

Additional shared menu categories include desserts and beverages.

The application aims to deliver an intuitive restaurant experience through a modern user interface, reliable ordering workflows, and convenient reservation management.

## ✨ Planned Features

### Customer Experience

- Modern, responsive restaurant homepage
- Restaurant information and promotional sections
- Browse menus across multiple cuisines
- Explore food categories and featured dishes
- Food item details and descriptions
- Shopping cart management
- Checkout and delivery ordering
- Customer registration and authentication
- Table reservation system
- Order history and status tracking
- Customer profile management

### Application Capabilities

- Responsive UI and reusable components
- Authentication and protected routes
- Database integration
- Form validation and error handling
- Server-side data operations
- Integration with the restaurant administration system

## 🛠️ Technology Stack

<<<<<<< HEAD
| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interface development |
| TypeScript | Static typing |
| Tailwind CSS | Styling and responsive design |
| Supabase | PostgreSQL database and file storage |
| Auth.js | Authentication |
| Git & GitHub | Version control |
=======
| Technology   | Purpose                              |
| ------------ | ------------------------------------ |
| Next.js      | Full-stack React framework           |
| React        | User interface development           |
| TypeScript   | Static typing                        |
| Tailwind CSS | Styling and responsive design        |
| Supabase     | PostgreSQL database and file storage |
| Auth.js      | Authentication                       |
| Git & GitHub | Version control                      |
>>>>>>> 1fac754 (integrate menu data and image from supabase)

Additional tools and technologies may be introduced as the project evolves.

## 🏗️ Application Architecture

Tasty Treat is planned as two independently maintained applications sharing a common database.

<<<<<<< HEAD
| Application | Repository | Responsibility |
|---|---|---|
| Customer Website | `tasty-treat-website` | Customer-facing restaurant website |
| Admin Dashboard | `tasty-treat-admin` | Restaurant operations and administration |
=======
| Application      | Repository            | Responsibility                           |
| ---------------- | --------------------- | ---------------------------------------- |
| Customer Website | `tasty-treat-website` | Customer-facing restaurant website       |
| Admin Dashboard  | `tasty-treat-admin`   | Restaurant operations and administration |
>>>>>>> 1fac754 (integrate menu data and image from supabase)

Both applications will use the shared Supabase PostgreSQL database.

Each application will have its own codebase and deployment lifecycle. Authentication and access control will ensure that administrative functionality is restricted to authorised users.

## 📁 Project Structure

The customer website uses the Next.js App Router.

```text
tasty-treat-website/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

The project structure will expand as features and reusable components are developed.

## ⚙️ Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/tasty-treat-website.git
```

Navigate to the project directory:

```bash
cd tasty-treat-website
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗺️ Development Roadmap

- [x] Initial Next.js project setup
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [ ] Customer website UI and layout
- [ ] Homepage and navigation
- [ ] Menu browsing and food item details
- [ ] Customer authentication
- [ ] Shopping cart and checkout
- [ ] Online ordering workflow
- [ ] Table reservation workflow
- [ ] Supabase integration
- [ ] Customer profile and order history
- [ ] Integration with the admin application
- [ ] Testing and quality assurance
- [ ] Docker containerization
- [ ] GitHub Actions CI/CD
- [ ] Production deployment

## 🎯 Project Objectives

The project is intended to demonstrate practical experience in:

- Modern frontend and full-stack application development
- React and Next.js application architecture
- Type-safe development using TypeScript
- Relational database design and integration
- Authentication and authorization
- Real-world e-commerce and reservation workflows
- Reusable, maintainable component architecture
- Testing, containerization, and CI/CD
- Production deployment practices

## 📌 Project Status

**Currently in development.**

This repository is under active development. The features listed above represent the planned functionality and are not necessarily implemented yet.

## 📄 License

No open-source license has been assigned yet.

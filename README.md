# Meridian — Centralized Healthcare Management Platform

Production-style **static** healthcare SaaS front end for Algominds Solutions Pvt. Ltd.  
No backend, API, or database — curated dummy data only.

**Live:** [https://meridiancaree.netlify.app](https://meridiancaree.netlify.app)  
**Source:** [github.com/Jeffinhashadz/Meridian-Care](https://github.com/Jeffinhashadz/Meridian-Care)

## Modules

1. Centralized Patient Profiles  
2. Medical History Management  
3. Medical Report Management  
4. Consultation Records  
5. Personalized Nutrition Plans  
6. Yoga & Wellness Progress Tracking  
7. Secure Role-Based Access (Admin, Doctor, Patient, Nutritionist, Yoga Instructor)

## Stack

- Vite + React + TypeScript  
- Tailwind CSS (design tokens) + Radix UI primitives  
- React Router, Recharts, Lucide, Framer Motion  
- Fraunces (headings) + Inter (body)

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Demo accounts (no password)

| Persona | Role | What they see |
|---------|------|----------------|
| Aisha Rahman | Administrator | All modules + Access Control |
| Dr. Elias Vance | Doctor | Clinical modules (no Access Control) |
| Maya Chen | Patient | Own records only via My Profile + clinical/wellness |
| Sofia Alvarez | Nutritionist | Patients + Nutrition (+ Dashboard) |
| Rohan Mehta | Yoga Instructor | Patients + Yoga (+ Dashboard) |

## Design decisions

- Quiet clinical surfaces (`#F3F7F6` ground, night-teal sidebar) — Linear × modern EHR, not a purple template.  
- Status always uses **text + color** chips.  
- Client-side RBAC with route guards and a demo-togglable permission matrix.  
- Mutations (add patient/report/visit/session) live in React state for the session only.  
- Netlify SPA fallback via `netlify.toml` + `public/_redirects`.

## Folder structure

```
src/
  app/                 # Root router
  components/ui|layout # Design system + shell
  context/             # Auth, Data, Search
  data/                # Typed static datasets
  features/            # Landing, modules, system pages
  hooks/ lib/ styles/ types/
```

## Note

All clinical content is **fictional / static** for UI review. Redeploy on Netlify after `npm run build` (publish `dist`) or via Git connect using `netlify.toml`.

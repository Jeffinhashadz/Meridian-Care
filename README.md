# Meridian Care

A modern, responsive **centralized healthcare management** front-end demo. Static/dummy data only — no backend, API, or database.

## Modules

1. **Centralized Patient Profiles** — searchable clinical roster + deep profile cards  
2. **Medical History Management** — chronological timeline with type filters  
3. **Medical Report Management** — labs, imaging, and diagnostic files  
4. **Consultation Records** — scheduled / completed visits with notes  
5. **Personalized Nutrition Plans** — macros, meals, adherence  
6. **Yoga & Wellness Progress** — session log + trend charts  
7. **Role-Based Access** — Admin, Doctor, Patient, Nutritionist, Yoga Instructor  

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Demo login

On the login screen, pick any persona — no password required:

| Role | Example user |
|------|----------------|
| Administrator | Aisha Rahman |
| Doctor | Dr. Elias Vance |
| Patient | Maya Chen |
| Nutritionist | Sofia Alvarez |
| Yoga Instructor | Rohan Mehta |

## Build

```bash
npm run build
npm run preview
```

## Deploy on Netlify (manual)

The app is Netlify-ready. For **drag-and-drop** deploy:

```bash
npm run build
```

Then on Netlify → your team → Projects, drop the **`dist`** folder (not the whole project).

`dist/_redirects` is included automatically so React Router paths work after refresh.

Optional Git import: connect the GitHub repo; `netlify.toml` sets `npm run build` → publish `dist`.

## Stack

- React 19 + TypeScript + Vite  
- React Router (role-guarded routes)  
- Recharts (wellness / nutrition visuals)  
- Lucide icons  

## License

Demo project for educational / portfolio submission.

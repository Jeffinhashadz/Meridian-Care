/**
 * Public marketing surface — brand-first hero, modules, personas, FAQ.
 */
import { motion } from 'framer-motion';
import {
  Apple,
  ArrowRight,
  FileText,
  Flower2,
  History,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

const MODULES = [
  { icon: Users, title: 'Patient Profiles', body: 'One roster for demographics, allergies, and care ownership.' },
  { icon: History, title: 'Medical History', body: 'Longitudinal timeline of diagnoses, procedures, and immunizations.' },
  { icon: FileText, title: 'Medical Reports', body: 'Labs and imaging with review status and findings drawers.' },
  { icon: Stethoscope, title: 'Consultations', body: 'In-person and telehealth visits with clinician notes.' },
  { icon: Apple, title: 'Nutrition Plans', body: 'Macros, meals, and adherence coached by nutritionists.' },
  { icon: Flower2, title: 'Yoga & Wellness', body: 'Session logs and mind-body progress across six weeks.' },
];

const ROLES = [
  { name: 'Administrator', focus: 'Access control & oversight' },
  { name: 'Doctor', focus: 'Clinical records & visits' },
  { name: 'Patient', focus: 'Personal health workspace' },
  { name: 'Nutritionist', focus: 'Personalized meal plans' },
  { name: 'Yoga Instructor', focus: 'Therapeutic progress' },
];

const FAQ = [
  {
    q: 'Is this connected to a real EHR?',
    a: 'No. Meridian is a static front-end demo with curated dummy data — ideal for UI review and stakeholder walkthroughs.',
  },
  {
    q: 'How do roles work?',
    a: 'Pick a persona on the login screen. Navigation and records are gated client-side for Admin, Doctor, Patient, Nutritionist, and Yoga Instructor.',
  },
  {
    q: 'Can I edit data?',
    a: 'Yes within the session. Modals add patients, history, reports, visits, and yoga sessions to local React state. Nothing is saved to a server.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-ground/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-white">M</span>
            <span className="font-display text-xl font-semibold">Meridian</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <a href="#modules" className="hover:text-ink">Modules</a>
            <a href="#roles" className="hover:text-ink">Roles</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <Button asChild>
            <Link to="/login">Enter workspace <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </header>

      <main id="main">
        <section className="relative overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_0%,rgba(20,135,127,0.12),transparent),radial-gradient(600px_300px_at_90%_20%,rgba(15,92,92,0.1),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="label-caps text-primary-signal">Centralized healthcare</p>
              <h1 className="mt-3 max-w-[14ch] font-display text-5xl leading-[1.05] text-ink md:text-6xl">
                One patient story. Every specialty.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted">
                Meridian unifies profiles, history, reports, consults, nutrition, and wellness in a single clinical workspace — crafted for modern care teams.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="default">
                  <Link to="/login">Enter workspace</Link>
                </Button>
                <Button asChild variant="secondary">
                  <a href="#modules">Explore modules</a>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-card border border-line bg-card p-4 shadow-soft"
            >
              <div className="rounded-[12px] bg-primary-night p-5 text-white">
                <div className="text-xs uppercase tracking-wider text-primary-mint">Live demo preview</div>
                <div className="mt-3 font-display text-2xl">Command Center</div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {['Active patients', 'Open reports', 'Nutrition plans', 'Yoga sessions'].map((k) => (
                    <div key={k} className="rounded-xl bg-white/5 p-3">
                      <div className="text-[11px] text-white/55">{k}</div>
                      <div className="mt-1 font-display text-xl">—</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="modules" className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-[32px]">Six care modules. One ledger.</h2>
          <p className="mt-2 max-w-2xl text-muted">Every module is interactive with static data — search, filter, add, and review without a backend.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full transition hover:-translate-y-0.5">
                  <CardBody>
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-ground text-primary">
                      <m.icon size={18} />
                    </div>
                    <h3 className="font-display text-xl">{m.title}</h3>
                    <p className="mt-2 text-sm text-muted">{m.body}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="roles" className="border-y border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={18} />
              <span className="label-caps">Role-based access</span>
            </div>
            <h2 className="mt-3 font-display text-[32px]">Five personas. Clear boundaries.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {ROLES.map((r) => (
                <div key={r.name} className="rounded-card border border-line p-4">
                  <div className="font-semibold">{r.name}</div>
                  <div className="mt-1 text-sm text-muted">{r.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-[32px]">FAQ</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-card border border-line bg-card p-5">
                <summary className="cursor-pointer list-none font-semibold marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 rounded-card bg-primary-night p-8 text-center text-white">
            <h3 className="font-display text-3xl">Ready to walk the workspace?</h3>
            <p className="mx-auto mt-2 max-w-md text-white/70">Sign in as any persona — no password — and explore the full product surface.</p>
            <Button asChild className="mt-6 bg-primary-mint text-primary-night hover:bg-white">
              <Link to="/login">Enter workspace</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        Meridian · Algominds Solutions Pvt. Ltd. demo · Static data only
      </footer>
    </div>
  );
}

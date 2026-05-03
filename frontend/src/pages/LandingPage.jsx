import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-grid bg-[size:42px_42px]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
          Team Task Manager
        </Link>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-16">
        <section className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-100">Project Workspace</p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Manage projects, tasks, and team ownership in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Team Task Manager helps admins create projects, assign members, track deadlines, and keep task status visible across the team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </section>

        <section className="card p-6">
          <div className="grid gap-4">
            {[
              ["Projects", "Create workspaces, add descriptions, and assign members."],
              ["Tasks", "Set priority, due dates, assignees, and progress status."],
              ["Roles", "Admins manage users and work. Members focus on assigned tasks."],
              ["Admin Domain", "Only users with an @raj.com email can become admins."]
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

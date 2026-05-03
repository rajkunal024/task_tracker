import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import PasswordVisibilityButton from "../components/PasswordVisibilityButton";
import { useAuth } from "../context/AuthContext";

const initialValues = {
  name: "",
  email: "",
  password: "",
  role: "member"
};

const canBecomeAdmin = (email = "") => email.trim().toLowerCase().endsWith("@raj.com");

const AuthPage = ({ mode = "login" }) => {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const title = useMemo(() => (isSignup ? "Create your workspace account" : "Welcome back"), [isSignup]);
  const adminAllowed = canBecomeAdmin(values.email);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => {
      const nextValues = {
        ...current,
        [name]: value
      };

      if (name === "email" && nextValues.role === "admin" && !canBecomeAdmin(value)) {
        nextValues.role = "member";
      }

      return nextValues;
    });
  };

  const validate = () => {
    if (isSignup && !values.name.trim()) {
      return "Name is required.";
    }

    if (!values.email.trim()) {
      return "Email is required.";
    }

    if (values.password.trim().length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (isSignup && values.role === "admin" && !adminAllowed) {
      return "Only users whose email ends with @raj.com can become admin.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      if (isSignup) {
        await signup(values);
      } else {
        await login({ email: values.email, password: values.password });
      }

      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#05052d] text-white">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base font-extrabold text-[#05052d]">T</span>
          <span>Team Task Manager</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-200 md:flex">
          <Link to="/" className="transition hover:text-white">Platform</Link>
          <Link to="/projects" className="transition hover:text-white">Projects</Link>
          <Link to="/tasks" className="transition hover:text-white">Tasks</Link>
          <Link to="/" className="transition hover:text-white">Resources</Link>
        </nav>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link to="/login" className={isSignup ? "text-slate-200 transition hover:text-white" : "text-white"}>
            Sign in
          </Link>
          <Link
            to="/signup"
            className={[
              "rounded-lg border px-4 py-2 transition",
              isSignup ? "border-white/80 text-white" : "border-white/35 text-slate-100 hover:border-white"
            ].join(" ")}
          >
            Sign up
          </Link>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_50%_72%,rgba(139,92,246,0.72),rgba(37,99,235,0.22)_28%,rgba(5,5,45,0)_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(180deg,rgba(5,5,45,0),rgba(15,23,42,0.96))]" />

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-200">
          {isSignup ? "Start managing work" : "Welcome back"}
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl">
          {isSignup ? "Build better teamwork, together" : "Continue where your team left off"}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
          {isSignup
            ? "Create your workspace account, organize projects, assign tasks, and keep deadlines visible across the team."
            : "Sign in to review project progress, update task status, and manage team ownership from one dashboard."}
        </p>

        <form className="mt-10 w-full max-w-3xl space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              id="name"
              name="name"
              className="h-16 w-full rounded-xl border border-white/20 bg-white px-5 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-white focus:ring-4 focus:ring-violet-400/30"
              placeholder="Enter your name"
              value={values.name}
              onChange={handleChange}
            />
          )}

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              id="email"
              name="email"
              type="email"
              className="h-16 rounded-xl border border-white/20 bg-white px-5 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-white focus:ring-4 focus:ring-violet-400/30 md:min-w-0"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
            />

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="h-16 w-full rounded-xl border border-white/20 bg-white px-5 pr-14 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-white focus:ring-4 focus:ring-violet-400/30"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />
              <PasswordVisibilityButton
                visible={showPassword}
                onPressStart={() => setShowPassword(true)}
                onPressEnd={() => setShowPassword(false)}
              />
            </div>

            <button
              type="submit"
              className="h-16 rounded-xl bg-emerald-600 px-8 text-base font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? <Loader label={isSignup ? "Creating" : "Signing in"} /> : isSignup ? "Sign up" : "Sign in"}
            </button>
          </div>

          {isSignup && (
            <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-[1fr_auto]">
              <select
                id="role"
                name="role"
                className="h-14 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white outline-none transition focus:border-white focus:ring-4 focus:ring-violet-400/30"
                value={values.role}
                onChange={handleChange}
              >
                <option className="text-slate-950" value="member">Member</option>
                <option className="text-slate-950" value="admin" disabled={!adminAllowed}>Admin</option>
              </select>
              <Link to="/login" className="inline-flex h-14 items-center justify-center rounded-xl border border-white/75 px-5 text-sm font-bold text-white transition hover:bg-white/10">
                I have an account
              </Link>
            </div>
          )}

          {isSignup && !adminAllowed && (
            <p className="text-sm text-slate-300">Admin requires an email ending with @raj.com.</p>
          )}

          {!isSignup && (
            <p className="text-sm text-slate-300">
              Need an account?{" "}
              <Link className="font-bold text-white underline decoration-white/40 underline-offset-4" to="/signup">
                Sign up
              </Link>
            </p>
          )}

          {error && <p className="rounded-xl border border-rose-300/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</p>}
        </form>

        <section className="mt-20 w-full rounded-[28px] border border-white/20 bg-slate-950/60 p-4 shadow-2xl shadow-violet-950/40 backdrop-blur">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 text-left">
            <div className="flex gap-2 border-b border-slate-800 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-slate-700" />
              <span className="h-3 w-3 rounded-full bg-slate-700" />
              <span className="h-3 w-3 rounded-full bg-slate-700" />
            </div>
            <div className="grid gap-0 md:grid-cols-[0.72fr_1.28fr]">
              <div className="border-b border-slate-800 p-6 md:border-b-0 md:border-r">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
                <p className="mt-5 text-sm font-semibold text-white">Project planning</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">Create projects, invite members, and give every task a clear owner.</p>
              </div>
              <div className="space-y-4 p-6">
                {["Design dashboard", "Assign backend API work", "Review deployment checklist"].map((task, index) => (
                  <div key={task} className="flex items-center justify-between rounded-xl bg-slate-800/70 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-200">{task}</span>
                    <span className={["text-brand-100", "text-amber-200", "text-emerald-300"][index]}>●</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;

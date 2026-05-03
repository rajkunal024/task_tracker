import { useEffect, useState } from "react";

import api from "../api/client";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import PasswordVisibilityButton from "../components/PasswordVisibilityButton";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "member"
};

const canBecomeAdmin = (email = "") => email.trim().toLowerCase().endsWith("@raj.com");

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const adminAllowed = canBecomeAdmin(form.email);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      const nextForm = { ...current, [name]: value };

      if (name === "email" && nextForm.role === "admin" && !canBecomeAdmin(value)) {
        nextForm.role = "member";
      }

      return nextForm;
    });
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!editingId && form.password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.role === "admin" && !adminAllowed) {
      setError("Only users whose email ends with @raj.com can become admin.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, payload);
      } else {
        await api.post("/users", payload);
      }

      resetForm();
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete user.");
    }
  };

  if (loading) {
    return <Loader label="Loading users" />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="text-sm text-slate-400">Create, update, and remove team accounts.</p>
        </div>

        {error && <p className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" className="input" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="password">{editingId ? "New Password" : "Password"}</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="input pr-14"
                value={form.password}
                onChange={handleChange}
              />
              <PasswordVisibilityButton
                visible={showPassword}
                onPressStart={() => setShowPassword(true)}
                onPressEnd={() => setShowPassword(false)}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="role">Role</label>
            <select id="role" name="role" className="input" value={form.role} onChange={handleChange}>
              <option value="member">Member</option>
              <option value="admin" disabled={!adminAllowed}>Admin</option>
            </select>
            {!adminAllowed && <p className="mt-2 text-xs text-slate-500">Admin requires an email ending with @raj.com.</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Update User" : "Create User"}</button>
            {editingId && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {users.length === 0 ? (
          <EmptyState title="No users yet" description="Create a user to start assigning project work." />
        ) : (
          users.map((teamUser) => (
            <article key={teamUser._id} className="card p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{teamUser.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{teamUser.email}</p>
                  <span className="badge mt-4 inline-flex bg-slate-800 text-slate-200">{teamUser.role}</span>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="btn-secondary" onClick={() => handleEdit(teamUser)}>Edit</button>
                  <button type="button" className="btn-secondary" onClick={() => handleDelete(teamUser._id)}>Delete</button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default UsersPage;

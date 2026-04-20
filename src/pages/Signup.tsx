import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    try {
      await signup(name, email, password);
      toast.success("Welcome to ZingBazaar!");
      navigate("/dashboard");
    } catch { toast.error("Signup failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="mx-auto grid max-w-md px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border bg-card p-8 shadow-card">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join the bazaar in seconds.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Field label="Full name" value={name} onChange={setName} required />
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field label="Password" type="password" value={password} onChange={setPassword} required />
          <Field label="Confirm password" type="password" value={confirm} onChange={setConfirm} required />
          <button disabled={busy} className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-full border bg-background py-3 text-sm font-semibold hover:bg-secondary">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-foreground hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
    </label>
  );
}

export default Signup;

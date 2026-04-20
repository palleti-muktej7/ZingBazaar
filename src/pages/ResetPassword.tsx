import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

function Reset() {
  const [pw, setPw] = useState("");
  const [c, setC] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== c) { toast.error("Passwords don't match"); return; }
    toast.success("Password updated");
    navigate("/login");
  };

  return (
    <div className="mx-auto grid max-w-md px-6 py-16">
      <div className="rounded-3xl border bg-card p-8 shadow-card">
        <h1 className="text-3xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose something memorable.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">New password</span>
            <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Confirm password</span>
            <input type="password" required value={c} onChange={(e) => setC(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
          </label>
          <button className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground">Update password</button>
        </form>
      </div>
    </div>
  );
}

export default Reset;

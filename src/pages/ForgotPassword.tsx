import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-md px-6 py-16">
      <div className="rounded-3xl border bg-card p-8 shadow-card">
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">We'll send a reset link to your email.</p>
        {sent ? (
          <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
            ✅ Reset link sent to <b>{email}</b>. Check your inbox.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Reset link sent"); }}>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
            </label>
            <button className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground">Send reset link</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered? <Link to="/login" className="font-semibold text-foreground hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Forgot;

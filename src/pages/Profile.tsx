import { } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function Profile() {
  const { user, isAuthenticated } = useAuth();
  if (typeof window !== "undefined" && !isAuthenticated) /* redirect handled by useEffect below */ if(typeof window!=="undefined") window.location.href="/login";

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const controls = useAnimation();
  useEffect(() => { setName(user?.name ?? ""); setEmail(user?.email ?? ""); }, [user]);

  const save = async () => {
    await controls.start({ scale: [1, 0.94, 1.04, 1], transition: { duration: 0.45 } });
    toast.success("Profile saved");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-sm text-muted-foreground">Update your personal details.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-[120px_1fr]">
        <div className="grid h-28 w-28 place-items-center rounded-full gradient-hero text-4xl font-bold text-primary-foreground">
          {(name || "Z")[0]?.toUpperCase()}
        </div>
        <div className="grid gap-4">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <motion.button
            animate={controls}
            onClick={save}
            className="w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground"
          >
            Save changes
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
    </label>
  );
}

export default Profile;

import { FiMapPin, FiPlus } from "react-icons/fi";

const ADDR = [
  { tag: "Home", line: "12 Lotus Apartments, MG Road, New Delhi 110001", default: true },
  { tag: "Work", line: "Floor 4, Cyber Hub, Gurugram 122002" },
];

function Addresses() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saved addresses</h1>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <FiPlus /> Add new
        </button>
      </div>
      <div className="space-y-3">
        {ADDR.map((a) => (
          <div key={a.tag} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-accent" />
                <div>
                  <div className="font-semibold">{a.tag} {a.default && <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Default</span>}</div>
                  <div className="text-sm text-muted-foreground">{a.line}</div>
                </div>
              </div>
              <button className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Addresses;

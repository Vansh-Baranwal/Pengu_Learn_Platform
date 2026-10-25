import React, { useState } from "react";
import { Clock3, ShieldCheck, TicketCheck } from "lucide-react";
const PROMO_DESTINATION = "https://drive.google.com/file/d/16n4Sa-UA4uJPqoM96AdopxK1vgkZ0PAK/view?usp=drive_link";

export default function DownloadSection() {
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const downloadWithPromo = event => {
    event.preventDefault();
    setNotice("");
    if (promo.trim().toUpperCase() !== "PENGUNEW") {
      setNotice("Invalid promo code.");
      return;
    }
    setBusy(true);
    window.open(PROMO_DESTINATION, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="download" className="relative w-full overflow-hidden border-t border-white/10 bg-black text-white idea-section-wrapper">
      <div className="min-h-screen py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 sm:px-6">
          <h1 className="w-full bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text py-2 text-center text-4xl font-semibold tracking-tight text-transparent sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>GET PENGU LEARN</h1>
          <p className="mt-3 max-w-2xl text-center text-sm text-neutral-400 sm:text-base">Enter your promo code for a free download.</p>

          <div className="mt-7 w-full max-w-xl rounded-2xl border border-white/10 bg-neutral-900/80 p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-widest text-sky-400">Lifetime access</p><p className="mt-2 text-3xl font-black">Free <span className="text-base font-medium text-neutral-400">with promo code</span></p></div>
              <ShieldCheck size={28} className="text-neutral-500" />
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <h2 className="flex items-center gap-2 font-semibold"><TicketCheck size={18} />Have a promo code?</h2>
              <button type="button" onClick={() => setPromo("PENGUNEW")} className="mt-3 flex w-full items-center justify-between gap-4 rounded-xl border border-sky-300/40 bg-gradient-to-r from-sky-400/15 to-cyan-300/5 px-4 py-3 text-left transition hover:border-sky-300/70 hover:bg-sky-400/20">
                <span><span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300">Free download for new users</span><span className="mt-1 block font-mono text-xl font-black tracking-wider text-white">PENGUNEW</span></span>
                <span className="shrink-0 rounded-full bg-sky-300 px-3 py-1.5 text-xs font-bold text-slate-950">Use code</span>
              </button>
              <form onSubmit={downloadWithPromo} className="mt-3 space-y-3">
                <input aria-label="Email address" type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter your email address" className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white" />
                <div className="flex gap-2">
                  <input aria-label="Promo code" value={promo} onChange={event => setPromo(event.target.value)} placeholder="Enter promo code" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white" />
                  <button type="submit" disabled={busy || !promo.trim() || !email.trim()} className="rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-40">{busy ? "Preparing..." : "Download"}</button>
                </div>
              </form>
              <p className="mt-2 text-xs text-neutral-500"><Clock3 size={12} className="mr-1 inline" />Add your email below, then use this code to start your download.</p>
            </div>
            {notice && <p role="status" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{notice}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

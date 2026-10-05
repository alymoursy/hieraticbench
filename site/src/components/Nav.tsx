"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/#leaderboard", label: "Leaderboard" },
  { href: "/dataset/", label: "Dataset" },
  { href: "/method/", label: "Method" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-8" aria-label="Main">
        <a href="/" aria-label="Homepage" className="flex items-center gap-2.5">
          <span className="text-xl font-medium tracking-tight">{site.name}</span>
          <span className="rounded-full bg-rubric-wash px-2 py-0.5 font-mono text-[0.6875rem] tracking-wide text-rubric">
            {site.version}
          </span>
        </a>
        <div className="flex items-center gap-8 max-md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-base text-stone-600 hover:text-ink">
              {l.label}
            </a>
          ))}
          <a
            href="/#join"
            className="rounded-full px-3.5 py-1.5 text-base text-ink ring-1 ring-black/15 hover:bg-stone-50"
          >
            Join
          </a>
        </div>
        <button
          type="button"
          className="relative -mr-2 rounded-full p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-black/5 px-6 pb-6 md:hidden">
          <ul role="list" className="flex flex-col">
            {[...links, { href: "/#join", label: "Join" }].map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

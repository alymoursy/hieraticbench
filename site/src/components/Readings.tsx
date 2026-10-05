"use client";

import { useEffect, useState } from "react";

type Reading = { model: string; reading: string };

/** The wrong readings, one at a time, struck through. The page's single moving part. */
export function Readings({ readings }: { readings: Reading[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % readings.length), 3600);
    return () => clearInterval(timer);
  }, [readings.length]);

  return (
    <>
    <ul role="list" className="sr-only">
      {readings.map((r) => (
        <li key={r.model + r.reading}>
          {r.model} said {r.reading}. Wrong.
        </li>
      ))}
    </ul>
    <div className="grid" aria-hidden="true">
      {readings.map((r, i) => (
        <p
          key={r.model + r.reading}
          className={`col-start-1 row-start-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg transition-[opacity,filter,translate] duration-700 ease-out motion-reduce:transition-none sm:text-xl ${
            i === active ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-1 opacity-0 blur-sm"
          }`}
        >
          <span className="text-stone-500">{r.model} said</span>
          <s className="italic decoration-rubric decoration-[1.5px]">{r.reading}</s>
        </p>
      ))}
    </div>
    </>
  );
}

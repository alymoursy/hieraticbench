"use client";

import { useEffect, useRef, useState } from "react";
import { ItemTile, type TileItem } from "@/components/ItemTile";

export type Group = { key: string; label: string; note: string; items: TileItem[]; compact?: boolean };

const PAGE = 24;

/** Tabs with counts over one grid, a page at a time. The tab lives in the URL hash so groups can be linked. */
export function DatasetBrowser({ groups }: { groups: Group[] }) {
  const [tab, setTab] = useState("all");
  const [shown, setShown] = useState<Record<string, number>>({});
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const fromHash = (event?: Event) => {
      const key = window.location.hash.slice(1);
      setTab(groups.some((g) => g.key === key) ? key : "all");
      // Coming from a "See all" link far down the page, bring the tabs back into view.
      if (event && nav.current && nav.current.getBoundingClientRect().top < 0) {
        nav.current.scrollIntoView({ block: "start" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  // On a phone the tab row scrolls sideways; keep the active tab visible.
  useEffect(() => {
    nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [tab]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const tabs = [{ key: "all", label: "All", count: total }, ...groups.map((g) => ({ key: g.key, label: g.label, count: g.items.length }))];
  const visible = tab === "all" ? groups : groups.filter((g) => g.key === tab);

  return (
    <div>
      <nav ref={nav} aria-label="Item groups" className="-mx-6 scroll-mt-20 overflow-x-auto px-6 lg:-mx-8 lg:px-8">
        <ul role="list" className="flex min-w-max gap-8 border-b border-black/10">
          {tabs.map((t) => (
            <li key={t.key}>
              <a
                href={t.key === "all" ? "#" : `#${t.key}`}
                onClick={(e) => {
                  if (t.key === "all") {
                    e.preventDefault();
                    history.replaceState(null, "", window.location.pathname);
                    setTab("all");
                  }
                }}
                aria-current={tab === t.key ? "page" : undefined}
                className={`-mb-px flex gap-2 border-b-2 py-3 text-lg sm:text-base ${
                  tab === t.key ? "border-ink text-ink" : "border-transparent text-stone-500 hover:text-ink"
                }`}
              >
                {t.label}
                <span className="text-stone-500 tabular-nums">{t.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {visible.map((g) => {
        const limit = tab === "all" ? (g.compact ? 12 : 8) : (shown[g.key] ?? (g.compact ? PAGE * 2 : PAGE));
        const items = g.items.slice(0, limit);
        const more = g.items.length - items.length;
        return (
          <section key={g.key} className="border-b border-black/5 py-14 last:border-b-0">
            <h2 className="text-3xl font-medium tracking-tight">
              {g.label} <span className="text-stone-500 tabular-nums">{g.items.length}</span>
            </h2>
            <p className="mt-4 max-w-[60ch] text-lg/8 text-pretty text-stone-600">{g.note}</p>
            <div
              className={`mt-10 grid ${
                g.compact ? "grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6" : "gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {items.map((item) => (
                <ItemTile key={item.id} item={item} compact={g.compact} />
              ))}
            </div>
            {more > 0 &&
              (tab === "all" ? (
                <a href={`#${g.key}`} className="mt-10 inline-flex text-lg text-ink underline decoration-black/20 hover:text-rubric hover:decoration-rubric">
                  See all {g.items.length} {g.label.toLowerCase()}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShown((s) => ({ ...s, [g.key]: limit + (g.compact ? PAGE * 2 : PAGE) }))}
                  className="mt-10 rounded-full px-4 py-2 text-lg text-ink ring-1 ring-black/15 hover:bg-stone-50 sm:text-base"
                >
                  Show {Math.min(more, g.compact ? PAGE * 2 : PAGE)} more <span className="text-stone-500 tabular-nums">of {more}</span>
                </button>
              ))}
          </section>
        );
      })}
    </div>
  );
}

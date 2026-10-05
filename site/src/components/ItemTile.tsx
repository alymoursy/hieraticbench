import type { Item } from "@/lib/data";
import { SCRIPT_LABEL, thumbUrl } from "@/lib/format";

export type TileItem = Item & { results?: { right: number; asked: number } };

export function ItemTile({ item, compact = false }: { item: TileItem; compact?: boolean }) {
  const meta = [item.object.date, item.object.holder].filter(Boolean).join(", ");
  const license = item.source.url ? (
    <a href={item.source.url} className="underline decoration-stone-300 hover:decoration-rubric">
      {item.source.license}
    </a>
  ) : (
    <span>{item.source.license}</span>
  );

  if (compact) {
    return (
      <figure className="flex flex-col gap-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-stone-50 p-3 outline-1 -outline-offset-1 outline-black/5">
          <img src={thumbUrl(item)} alt="" loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply" />
        </div>
        <figcaption className="text-sm/5 text-pretty text-stone-600">
          <p className="line-clamp-2">{item.object.period ?? item.object.date ?? item.object.name}</p>
          <p>{license}</p>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="flex flex-col gap-4">
      <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl bg-stone-50 p-4 outline-1 -outline-offset-1 outline-black/5">
        <img src={thumbUrl(item)} alt="" loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply" />
      </div>
      <figcaption className="flex flex-col gap-1 text-base text-stone-600 sm:text-sm/6">
        <p className="line-clamp-3 text-lg/6 text-pretty text-ink sm:text-base/6" title={item.title}>
          {item.title}
        </p>
        {meta && <p className="text-pretty">{meta}</p>}
        <p className="flex flex-wrap gap-x-3">
          {item.split === "sealed" ? (
            <span className="text-rubric">Sealed</span>
          ) : (
            item.rungs.includes("identify") && item.script && <span>{SCRIPT_LABEL[item.script] ?? item.script}</span>
          )}
          {item.rungs.includes("signs") && item.split === "public" && <span>Single sign</span>}
          {license}
        </p>
        {item.results && item.results.asked > 0 && item.rungs.includes("identify") && (
          <p className="tabular-nums">
            Named correctly by {item.results.right} of {item.results.asked} models
          </p>
        )}
      </figcaption>
    </figure>
  );
}

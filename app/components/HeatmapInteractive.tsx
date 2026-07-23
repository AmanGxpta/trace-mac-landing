"use client";

import { useState } from "react";
import type { HeatmapCell } from "@/lib/heatmap";

const DONES = [
  "shipped the heatmap colour scale", "fixed the archive confirm dialog",
  "linked the repo, opened it in Cursor", "wired keyboard nav into the kanban",
  "tuned the task-aging thresholds", "exported the week to markdown",
  "merged the tags branch", "closed the SQLite vacuum issue",
  "polished the focus-end sweep", "renamed the project from trace-v0",
];
const LOGS = [
  "the 24-hour lock is the whole point", "frictionless logging beats every feature",
  "combined view finally feels right", "neglect should be visible, not hidden",
  "keep the surface small on purpose", "no nags — only a countdown you chose",
];
const TIMES = ["09:14", "10:42", "11:58", "14:07", "15:33", "17:20", "18:49"];

type Entry = { time: string; kind: "done" | "log"; text: string };

/** Deterministic from the cell's position, so a day always reads the same. */
function entriesFor(index: number, level: number): Entry[] {
  const n = Math.min(level + (level >= 3 ? 1 : 0), 5);
  const entries: Entry[] = [];
  for (let k = 0; k < n; k++) {
    const seed = index + k;
    const isLog = seed % 3 === 0;
    entries.push({
      time: TIMES[seed % TIMES.length],
      kind: isLog ? "log" : "done",
      text: isLog ? LOGS[seed % LOGS.length] : DONES[seed % DONES.length],
    });
  }
  return entries.sort((a, b) => a.time.localeCompare(b.time));
}

export default function HeatmapInteractive({ cells }: { cells: HeatmapCell[] }) {
  const [sel, setSel] = useState<number | null>(null);

  const selected = sel === null ? null : cells[sel];
  const entries = selected ? entriesFor(sel!, selected.level) : [];
  const doneCount = entries.filter((e) => e.kind === "done").length;

  return (
    <>
      {/* Header — title left, legend right */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-[18px]">
        <span className="font-mono text-[13px] text-ink-dim">
          Trace · last 12 months
        </span>
        <div className="flex items-center gap-[7px] font-mono text-[12px] text-ink-faint">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="cell" data-l={l} />
          ))}
          More
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto pb-1">
        <div
          className="grid gap-[3px] w-max"
          style={{ gridAutoFlow: "column", gridTemplateRows: "repeat(7,13px)" }}
        >
          {cells.map((c, i) => (
            <span
              key={i}
              title={c.label}
              onClick={() => setSel(i)}
              className={`cell cursor-pointer${sel === i ? " sel" : ""}`}
              data-l={c.level}
            />
          ))}
        </div>
      </div>

      {/* Day detail panel */}
      <div className="mt-[22px] border-t border-line pt-5 min-h-[96px]">
        {entries.length > 0 ? (
          <div className="heat-detail-anim">
            <div className="font-mono text-[12.5px] text-ink-faint uppercase tracking-[.12em]">
              {selected!.label} · {doneCount} completed,{" "}
              {entries.length - doneCount} logged
            </div>
            <div className="mt-3 flex flex-col gap-[9px]">
              {entries.map((e, i) => (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] text-ink-faint w-[46px] flex-none">
                    {e.time}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-[2px] rounded-full border border-line2 text-ink-dim flex-none">
                    {e.kind}
                  </span>
                  <span className="text-[14px] text-ink">{e.text}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="font-mono text-[13px] text-ink-faint pt-1">
            Click any cell to read exactly what you completed and logged that
            day.
          </p>
        )}
      </div>
    </>
  );
}

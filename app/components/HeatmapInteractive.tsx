"use client";

import { useState, useCallback } from "react";
import type { HeatmapData } from "@/lib/heatmap";

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

function pseudo(seed: number) {
  let s = (seed * 2654435761) & 0x7fffffff;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

const MS_DAY = 86400000;
const TODAY = new Date(2026, 5, 5);
const LAST_COL = 25, LAST_ROW = 5;

type DayEntry = { isLog: boolean; text: string; hh: number; mm: number };
type DayDetail = { date: string; entries: DayEntry[] };

function buildDayDetail(w: number, d: number, lv: number): DayDetail {
  const r = pseudo(w * 7 + d + 1);
  const daysFromEnd = (LAST_COL - w) * 7 + (LAST_ROW - d);
  const dt = new Date(TODAY.getTime() - daysFromEnd * MS_DAY);
  const date = dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  if (lv === 0) return { date, entries: [] };

  const n = Math.min(lv + (r() > 0.6 ? 1 : 0), 5);
  const entries: DayEntry[] = [];
  for (let k = 0; k < n; k++) {
    const isLog = r() > 0.62;
    const arr = isLog ? LOGS : DONES;
    entries.push({
      isLog,
      text: arr[Math.floor(r() * arr.length)],
      hh: 9 + Math.floor(r() * 10),
      mm: Math.floor(r() * 60),
    });
  }
  return { date, entries };
}

export default function HeatmapInteractive({ levels, active, months }: HeatmapData) {
  const [detail, setDetail] = useState<(DayDetail & { w: number; d: number }) | null>(() => {
    // Pre-open the most recent active cell
    for (let w = 25; w >= 0; w--) {
      for (let d = 6; d >= 0; d--) {
        if (levels[w]?.[d] >= 2) {
          return { ...buildDayDetail(w, d, levels[w][d]), w, d };
        }
      }
    }
    return null;
  });

  const handleCellClick = useCallback((w: number, d: number, lv: number) => {
    setDetail({ ...buildDayDetail(w, d, lv), w, d });
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-[18px] mb-[22px]">
        <div className="font-mono text-[14px] text-ink flex items-center gap-[9px]">
          <span className="w-[9px] h-[9px] rounded-full bg-accent shadow-[0_0_9px_var(--accent)]" />
          #trace
        </div>
        <div className="font-mono text-[12px] text-ink-faint">
          <b className="text-ink-dim font-medium">{active}</b> active days since this project began · last logged <b className="text-ink-dim font-medium">2m ago</b>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex gap-[11px] items-start overflow-x-auto pb-[6px]">
        <div className="grid grid-rows-7 gap-1 font-mono text-[10px] text-ink-faint pt-[18px]"
          style={{ gridTemplateRows: "repeat(7,1fr)" }}>
          <span className="h-[13px] leading-[13px]" />
          <span className="h-[13px] leading-[13px]">Mon</span>
          <span className="h-[13px] leading-[13px]" />
          <span className="h-[13px] leading-[13px]">Wed</span>
          <span className="h-[13px] leading-[13px]" />
          <span className="h-[13px] leading-[13px]">Fri</span>
          <span className="h-[13px] leading-[13px]" />
        </div>
        <div className="min-w-0">
          <div className="flex font-mono text-[10.5px] text-ink-faint mb-[7px]">
            {months.map((m, i) => (
              <span key={i} style={{ width: `${(13 + 4) * m.w}px` }}>{m.name}</span>
            ))}
          </div>
          <div className="grid gap-1" style={{ gridAutoFlow: "column", gridTemplateRows: "repeat(7,1fr)" }}>
            {levels.flatMap((week, w) =>
              week.map((lv, d) => (
                <span
                  key={`${w}-${d}`}
                  className={`cell${lv > 0 ? " cursor-pointer" : ""}${detail?.w === w && detail?.d === d ? " sel" : ""}`}
                  data-l={lv}
                  onClick={lv > 0 ? () => handleCellClick(w, d, lv) : undefined}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-5 font-mono text-[11px] text-ink-faint">
        <span>Less</span>
        <span className="flex gap-1">
          {[0,1,2,3,4].map(l => <span key={l} className="cell" data-l={l} />)}
        </span>
        <span>More</span>
        <span className="ml-auto text-right">Task creation is not shown — only what you finished or wrote.</span>
      </div>

      {/* Day detail panel */}
      {detail && (
        <div className="mt-5 border-t border-dashed border-line2 pt-[18px] heat-detail-anim">
          <div className="font-mono text-[12.5px] text-ink flex items-center gap-[10px]">
            <b className="text-accent font-semibold">{detail.date}</b>
            <span className="text-ink-faint text-[11.5px] ml-auto">
              {detail.entries.length === 0 ? "no activity" : `${detail.entries.length} ${detail.entries.length === 1 ? "activity" : "activities"}`}
            </span>
          </div>
          {detail.entries.length === 0 ? (
            <div className="font-mono text-[12.5px] text-ink-faint mt-[13px]">
              — nothing logged. A square you didn&apos;t earn stays grey.
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-[13px]">
              {detail.entries.map((e, i) => (
                <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-[11px] items-center">
                  <span className={`font-mono text-[11.5px] font-semibold px-[7px] py-[2px] rounded-[6px] border whitespace-nowrap ${e.isLog ? "border-[rgba(176,138,255,.28)] bg-[rgba(176,138,255,.1)] text-[#c9a6ff]" : ""}`}
                    style={e.isLog ? {} : {
                      color: "var(--accent)",
                      background: "color-mix(in oklab,var(--accent) 12%,transparent)",
                      borderColor: "color-mix(in oklab,var(--accent) 30%,transparent)",
                    }}>
                    {e.isLog ? "/log" : "/done"}
                  </span>
                  <span className="text-[13px] text-ink-dim overflow-hidden text-ellipsis whitespace-nowrap">{e.text}</span>
                  <span className="font-mono text-[11px] text-ink-faint whitespace-nowrap">
                    {String(e.hh).padStart(2,"0")}:{String(e.mm).padStart(2,"0")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

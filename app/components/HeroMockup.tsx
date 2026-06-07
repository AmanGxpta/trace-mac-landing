"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Row = { id: number; cmd: string; cls: string; node: ReactNode; when: string; enter?: boolean };

const INITIAL_ROWS: Row[] = [
  { id: 0, cmd: "/done", cls: "done", node: "shipped the heatmap colour scale", when: "2m" },
  { id: 1, cmd: "/log",  cls: "log",  node: "the 24-hour lock is the whole point", when: "14m" },
  { id: 2, cmd: "/done", cls: "done", node: "linked the repo, opened it in Cursor", when: "1h" },
  { id: 3, cmd: "/task", cls: "task", node: "read the circuits thread", when: "3h" },
];

const SEQ: { cmd: string; cls: string; text: string; node: ReactNode }[] = [
  { cmd: "/done", cls: "done", text: "wired up the 24-hour activity lock",   node: "wired up the 24-hour activity lock" },
  { cmd: "/log",  cls: "log",  text: "frictionless logging beats every feature", node: "frictionless logging beats every feature" },
  {
    cmd: "/task", cls: "task", text: "#llm-evals chase the flaky retry",
    node: <><span className="text-ink-faint font-mono text-[12.5px]">#llm-evals</span> chase the flaky retry</>,
  },
  { cmd: "/done", cls: "done", text: "started a 25-min focus block", node: "started a 25-min focus block" },
];

const CMD_STYLES: Record<string, { color: string; background: string; borderColor: string }> = {
  done: {
    color: "var(--accent)",
    background: "color-mix(in oklab,var(--accent) 12%,transparent)",
    borderColor: "color-mix(in oklab,var(--accent) 30%,transparent)",
  },
  log: { color: "#c9a6ff", background: "rgba(176,138,255,.1)", borderColor: "rgba(176,138,255,.28)" },
  task: { color: "var(--ink-dim)", background: "rgba(255,255,255,.04)", borderColor: "var(--line-2)" },
};

export default function HeroMockup() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [input, setInput] = useState("");
  const [shown, setShown] = useState(false);
  const nextId = useRef(INITIAL_ROWS.length);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    function typeNext() {
      const item = SEQ[i % SEQ.length];
      const full = `${item.cmd} ${item.text}`;
      let pos = 0;
      function type() {
        if (!alive) return;
        if (pos <= full.length) {
          setInput(full.slice(0, pos)); pos++;
          timer = setTimeout(type, 34 + Math.random() * 46);
        } else { timer = setTimeout(commit, 620); }
      }
      function commit() {
        if (!alive) return;
        setRows((prev) => [{ id: nextId.current++, cmd: item.cmd, cls: item.cls, node: item.node, when: "now", enter: true }, ...prev].slice(0, 5));
        setInput(""); i++;
        timer = setTimeout(typeNext, 1500);
      }
      type();
    }
    timer = setTimeout(typeNext, 1100);
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  return (
    <div className={`mt-[62px] relative reveal${shown ? " in" : ""}`}>
      {/* Menubar */}
      <div className="max-w-[980px] mx-auto h-[30px] rounded-t-[9px] border border-b-0 border-line flex items-center justify-end gap-[18px] px-[14px] font-mono text-[12px] text-ink-dim relative z-[1]"
        style={{ background: "linear-gradient(#1b1f25,#15181d)" }}>
        <div className="flex items-center gap-4">
          {/* generic system icons */}
          <span className="opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[15px] h-[15px]">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </span>
          <span className="opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[15px] h-[15px]">
              <path d="M12 3a6 6 0 00-6 6c0 4-2 5-2 5h16s-2-1-2-5a6 6 0 00-6-6z" />
            </svg>
          </span>
          {/* Timer chip */}
          <span className="inline-flex items-center gap-[6px] font-mono text-[12px] font-semibold tracking-[.02em] px-[9px] py-[2px] rounded-[7px] border"
            style={{
              color: "var(--accent)",
              background: "color-mix(in oklab,var(--accent) 14%,transparent)",
              borderColor: "color-mix(in oklab,var(--accent) 32%,transparent)",
            }}>
            <span className="timer-pulse" />
            18:32
          </span>
          {/* Trace icon */}
          <span className="flex items-center gap-[7px] border border-line2 rounded-[7px] px-2 py-[2px] pl-[5px] mr-[2px] text-ink"
            style={{ background: "rgba(255,255,255,.09)" }}>
            <Image src="/trace-icon.png" alt="" width={15} height={15} className="rounded-[4px]" />
          </span>
        </div>
        <span className="text-ink font-medium">Fri 9:41</span>
      </div>

      {/* Panel */}
      <div className="max-w-[520px] mx-auto relative z-[2] border border-line2 rounded-[16px] overflow-hidden text-left shadow-[0_40px_90px_-30px_rgba(0,0,0,.85),inset_0_2px_0_rgba(255,255,255,.03)]"
        style={{ background: "linear-gradient(180deg,var(--panel-2),var(--panel))" }}>
        {/* notch */}
        <div className="absolute top-[-7px] right-[64px] w-[13px] h-[13px] bg-panel-2 border-l border-t border-line2 rotate-45 z-[3]" />

        {/* Project tabs */}
        <div className="flex items-center justify-between px-[15px] py-[13px] border-b border-line">
          <div className="flex gap-[7px] items-center flex-wrap">
            {/* Active pill with tag */}
            <span className="font-mono text-[12px] text-ink inline-flex items-center gap-[6px] px-[9px] py-1 rounded-[7px] border border-line2 bg-white/[0.05]">
              <span className="w-[7px] h-[7px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
              trace
              <span className="font-mono text-[9.5px] text-ink-faint border border-line px-[5px] py-[1px] rounded-[5px] ml-[3px] bg-white/[0.05]">swift</span>
            </span>
            <span className="font-mono text-[12px] text-ink-dim inline-flex items-center gap-[6px] px-[9px] py-1 rounded-[7px] border border-transparent">
              <span className="w-[7px] h-[7px] rounded-full bg-ink-faint" />
              llm-evals
              <span className="font-mono text-[9.5px] text-ink-faint border border-line px-[5px] py-[1px] rounded-[5px] ml-[3px] bg-white/[0.05]">research</span>
            </span>
            <span className="font-mono text-[12px] text-ink-dim inline-flex items-center gap-[6px] px-[9px] py-1 rounded-[7px] border border-transparent">
              <span className="w-[7px] h-[7px] rounded-full bg-ink-faint" />
              field-notes
            </span>
            <span className="font-mono text-[12px] text-ink-faint inline-flex items-center gap-[6px] px-[9px] py-1 rounded-[7px] border border-transparent opacity-55">
              <span className="w-[7px] h-[7px] rounded-full border border-ink-faint" />
              the-zine
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-faint tracking-[.04em]">#trace</span>
        </div>

        {/* Feed */}
        <div className="px-[7px] py-[6px] min-h-[188px]">
          {rows.map((r) => (
            <div key={r.id} className={`grid grid-cols-[auto_1fr_auto] items-center gap-[11px] px-[9px] py-[9px] rounded-[9px] mt-[1px] first:mt-0${r.enter ? " row-enter" : ""}`}>
              <span className="font-mono text-[11.5px] font-semibold px-[7px] py-[2px] rounded-[6px] whitespace-nowrap border"
                style={CMD_STYLES[r.cls]}>
                {r.cmd}
              </span>
              <span className="text-[13.5px] text-ink overflow-hidden text-ellipsis whitespace-nowrap">{r.node}</span>
              <span className="font-mono text-[11px] text-ink-faint whitespace-nowrap">{r.when}</span>
            </div>
          ))}
        </div>

        {/* CLI input */}
        <div className="border-t border-line px-[15px] py-[13px] flex items-center gap-[11px] bg-white/[0.015]">
          <span className="font-mono text-accent text-[15px] font-bold">›</span>
          <span className="font-mono text-[14px] text-ink min-h-[20px] flex-1 whitespace-nowrap overflow-hidden">{input}</span>
          <span className="cli-cursor" />
          <span className="font-mono text-[10.5px] text-ink-faint border border-line2 rounded-[5px] px-[7px] py-[2px]">↵</span>
        </div>
      </div>
    </div>
  );
}

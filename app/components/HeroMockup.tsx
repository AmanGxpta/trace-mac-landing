"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Row = {
  id: number;
  cmd: string;
  cls: string;
  node: ReactNode;
  when: string;
  enter?: boolean;
};

const INITIAL_ROWS: Row[] = [
  { id: 0, cmd: "/done", cls: "done", node: "shipped the heatmap colour scale", when: "2m" },
  { id: 1, cmd: "/log", cls: "log", node: "the 24-hour lock is the whole point", when: "14m" },
  { id: 2, cmd: "/done", cls: "done", node: "fixed the archive confirm dialog", when: "1h" },
  { id: 3, cmd: "/task", cls: "task", node: "read the circuits thread", when: "3h" },
];

const SEQ: { cmd: string; cls: string; text: string; node: ReactNode }[] = [
  {
    cmd: "/done",
    cls: "done",
    text: "wired up the 24-hour activity lock",
    node: "wired up the 24-hour activity lock",
  },
  {
    cmd: "/log",
    cls: "log",
    text: "frictionless logging beats every feature",
    node: "frictionless logging beats every feature",
  },
  {
    cmd: "/task",
    cls: "task",
    text: "#llm-evals chase the flaky retry",
    node: (
      <>
        <span className="hash">#llm-evals</span> chase the flaky retry
      </>
    ),
  },
  {
    cmd: "/done",
    cls: "done",
    text: "archived the-zine — shipping it later",
    node: "archived the-zine — shipping it later",
  },
];

export default function HeroMockup() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [input, setInput] = useState("");
  const [shown, setShown] = useState(false);
  const nextId = useRef(INITIAL_ROWS.length);

  // Entrance fade-in (the original wrapped the stage in a reveal).
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Animated slash-command demo: types a command, then commits it to the feed.
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
          setInput(full.slice(0, pos));
          pos++;
          timer = setTimeout(type, 34 + Math.random() * 46);
        } else {
          timer = setTimeout(commit, 620);
        }
      }

      function commit() {
        if (!alive) return;
        setRows((prev) =>
          [
            {
              id: nextId.current++,
              cmd: item.cmd,
              cls: item.cls,
              node: item.node,
              when: "now",
              enter: true,
            },
            ...prev,
          ].slice(0, 5),
        );
        setInput("");
        i++;
        timer = setTimeout(typeNext, 1500);
      }

      type();
    }

    timer = setTimeout(typeNext, 1100);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`stage reveal${shown ? " in" : ""}`}>
      <div className="menubar">
        <div className="tray">
          <span className="ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </span>
          <span className="ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 3a6 6 0 00-6 6c0 4-2 5-2 5h16s-2-1-2-5a6 6 0 00-6-6z" />
            </svg>
          </span>
          <span className="ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </span>
          <span className="trace-ico">
            <Image src="/trace-icon.png" alt="" width={15} height={15} />
          </span>
        </div>
        <span className="clock">Fri 9:41</span>
      </div>

      <div className="panel">
        <div className="notch" />
        <div className="panel-head">
          <div className="proj-tabs">
            <span className="pill active">
              <span className="dot" />
              trace
            </span>
            <span className="pill">
              <span className="dot" />
              llm-evals
            </span>
            <span className="pill">
              <span className="dot" />
              field-notes
            </span>
            <span className="pill arch">
              <span className="dot" />
              the-zine
            </span>
          </div>
          <span className="scope">#trace</span>
        </div>

        <div className="feed">
          {rows.map((r) => (
            <div key={r.id} className={`row${r.enter ? " enter" : ""}`}>
              <span className={`cmd ${r.cls}`}>{r.cmd}</span>
              <span className="txt">{r.node}</span>
              <span className="when">{r.when}</span>
            </div>
          ))}
        </div>

        <div className="cli">
          <span className="prompt">›</span>
          <span className="input">{input}</span>
          <span className="cursor" />
          <span className="ret">↵</span>
        </div>
      </div>
    </div>
  );
}

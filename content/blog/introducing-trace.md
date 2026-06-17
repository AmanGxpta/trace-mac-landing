---
title: "Introducing Trace: an honest record of what you actually did"
date: 2026-06-17
author: Navitek Labs
tags: [launch, macos, productivity, trace]
description: >-
  Trace is a keyboard-driven macOS menubar app for people running several
  projects at once. Log work in under five seconds, and watch a per-project
  heatmap built from your real activity — not your intentions. Free, local,
  and out today.
---

# Introducing Trace

Today we're releasing **Trace v0.1.0** — a macOS menubar app for people who run
several projects at once and keep losing the thread of what they actually got
done.

Trace answers one deceptively hard question: **"What did I *actually* do?"**

Notion and Linear tell you what *needs* to be done. Your calendar tells you what
you *planned*. Neither one tells you what you've been doing — and once you're
juggling five projects, that question gets genuinely difficult to answer
honestly. Trace is built to answer it, and to make answering it cost you almost
nothing.

> Built and used daily at **Navitek Labs**, where it started as the thing we
> wished existed and quietly became the thing we open all day.

[**Download Trace for macOS →**](/downloads/Trace-0.1.0.dmg)

---

## Everything runs through one input

Trace lives in your menubar. Hit the shortcut, and a single dropdown appears
with one text field at the bottom. Every action is a slash command typed into
that field — no menus, no buttons to hunt for, no "journaling mode" to switch
into.

The core loop is three commands:

| Command | What it does |
| --- | --- |
| `/task <text>` | Create a pending task in the current project. |
| `/done <text>` | Create *and* immediately complete a task. Counts as activity. |
| `/log <text>` | Add a short journal entry. Counts as activity. |

Organise a project without leaving it:

| Command | What it does |
| --- | --- |
| `/rename-project <name>` | Rename the project you're focused on. |
| `/add-tag <tag>` | Tag the current project for grouping. |
| `/remove-tag <tag>` | Strip a tag back off. |

And navigate everything from the global view:

| Command | What it does |
| --- | --- |
| `/filter <tag>` | Show only projects with a tag. `/filter` alone clears it. |
| `/done #proj <text>` | Target any project by name, from anywhere. |
| `/show-all` · `/show-active` | Fold archived projects into the list, or hide them again. |
| `/help` | Show every command inline, in place. |

It's **explicit over magical**. Typos produce errors, not autocorrect. From the
global view you always name the project — and typing `#` tab-completes project
names, quotes and all. Logging your first `/done` takes about five seconds.

---

## A heatmap that can't be edited into a lie

Every project gets a GitHub-style heatmap, from the day you created it to today.

Here's the part we care about most: **the heatmap reflects real work, and it
can't be rewritten.** Only completions and journal entries count toward it —
creating a task does *not* — and once an activity is more than 24 hours old,
it's immutable. You can't check things off before you've done them and then
quietly edit history. The record stays honest because it *can't* be anything
else.

Click any day to see exactly what you logged — which tasks you completed, which
notes you wrote, and when, down to the minute.

And you can zoom out. The **Combined view** fuses every visible project into one
heatmap, with each project's own map stacked below it in its own colour. It
respects your current filter, so you can look at everything, just the active
projects, or a single tag. When one of your five projects is quietly being
starved of attention, this is where you see it — stated neutrally, never as a
nag.

---

## Built for developers

Link a project to a folder once, and the tools you already live in are one click
from the log:

- **Open in Cursor** — launch the linked folder straight into your editor.
- **Open in cmux** — drop into a named workspace when socket access allows.
- **Open the repo** — resolves your `git origin` and opens it in the browser.

The folder path is stored locally, per project. It's one step toward
auto-logging — never a sync.

---

## Deliberately small

Trace is **not** a planner, **not** a team tool, **not** a knowledge base. It
isn't gamified, isn't AI-powered, and has no accounts or sync. Every "no" there
is a decision, not a missing feature.

- **Fully local.** Every byte lives in one SQLite file on your machine. No
  account, no network calls for logging, no telemetry.
- **It doesn't act on you; you act on it.** No notifications, no nags, no badge
  on the menubar icon — the only thing that ever moves is a focus-timer
  countdown while *you've* chosen to run one.
- **Asymmetric friction.** Tasks are cheap to delete. Journal entries ask for
  confirmation. Permanent deletion doesn't exist — archiving is a quiet toggle
  in the project header.

This is Phase 0. It ships zero AI features on purpose: we want the core loop
proven before anything clever gets added.

---

## Get it

Trace is **free**, runs on **macOS 14 Sonoma or later**, and is universal
(Apple Silicon & Intel). The download is a 3.3 MB `.dmg` — drag it to
Applications and log your first `/done` in the next five seconds.

[**Download Trace for macOS →**](/downloads/Trace-0.1.0.dmg)

---

*Trace is built and used daily at Navitek Labs. We'd love to hear what you
record with it.*

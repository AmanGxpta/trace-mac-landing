import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const iconData = await readFile(
    join(process.cwd(), "public", "trace-icon.png"),
  );
  const iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0b0d",
          color: "#ececea",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* subtle top glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: 400,
            width: 700,
            height: 500,
            background:
              "radial-gradient(closest-side, rgba(232,232,230,0.10), transparent 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} width={84} height={84} style={{ borderRadius: 20 }} alt="" />
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            trace
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#666c73",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: 8,
              padding: "4px 12px",
              marginLeft: 4,
            }}
          >
            macOS menubar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            An honest record of what you actually did.
          </div>
          <div style={{ fontSize: 30, color: "#9aa0a6", maxWidth: 920, lineHeight: 1.4 }}>
            Log tasks and notes with slash commands in under five seconds — then
            watch a per-project heatmap built from your real work.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#666c73" }}>
          <span>Free</span>
          <span>·</span>
          <span>macOS 14 Sonoma+</span>
          <span>·</span>
          <span>Apple Silicon &amp; Intel</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

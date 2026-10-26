import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company, project } from "@/content/site";

export const alt = `${project.name} by ${company.name}: ${project.type.toLowerCase()} in ${project.city}, launching ${project.launch}. Artist's impression of the building at dusk.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static TTFs (Satori can't read woff2). Read once at module scope.
const zodiak = await readFile(join(process.cwd(), "src/app/og/zodiak-400.ttf"));
const switzer = await readFile(join(process.cwd(), "src/app/og/switzer-500.ttf"));
const render = await readFile(join(process.cwd(), "src/assets/media/project-n-front.jpg"));
const logo = await readFile(join(process.cwd(), "src/assets/brand/nethravathi-group-logo.png"));

const dataUrl = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#26352b" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl(render, "image/jpeg")}
          alt=""
          width={1290}
          height={630}
          style={{ position: "absolute", left: -45, top: 0, width: 1290, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, rgba(38,53,43,0.95) 0%, rgba(38,53,43,0.86) 42%, rgba(38,53,43,0.35) 72%, rgba(38,53,43,0.1) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", width: "100%" }}>
          <div style={{ display: "flex", background: "#f7f5ee", padding: "10px 12px", alignSelf: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl(logo, "image/png")} alt="" width={78} height={88} style={{ width: 78, height: 88 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Zodiak", fontSize: 104, lineHeight: 1, color: "#f7f5ee", letterSpacing: -2 }}>{project.name}</div>
            <div style={{ fontFamily: "Switzer", fontSize: 30, color: "rgba(247,245,238,0.9)", marginTop: 18 }}>
              {`Premium 3 & 4 BHK apartments in ${project.city}`}
            </div>
            <div style={{ fontFamily: "Switzer", fontSize: 20, color: "#b9c9af", marginTop: 14, letterSpacing: 3, textTransform: "uppercase" }}>
              {`Launching ${project.launch} · ${company.name}`}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zodiak", data: zodiak, weight: 400, style: "normal" },
        { name: "Switzer", data: switzer, weight: 500, style: "normal" },
      ],
    },
  );
}

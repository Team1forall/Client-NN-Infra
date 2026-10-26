import type { MetadataRoute } from "next";
import { company, project, seo } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${project.name} by ${company.name}`,
    short_name: company.name,
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#f7f5ee",
    theme_color: "#f7f5ee",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

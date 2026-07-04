import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Current catalog images are locally-generated placeholder SVGs — tiny,
    // already vector, and nothing to gain from raster optimization. Also
    // sidesteps a Turbopack dev-server race in the image optimizer where
    // concurrent first-time requests for the same SVG variant occasionally
    // returned an empty 200 body.
    unoptimized: true,
  },
};

export default nextConfig;

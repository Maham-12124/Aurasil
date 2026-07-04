import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack's on-disk dev cache (default since Next 16.1) writes rapidly
    // to .next/dev/cache/turbopack. This project lives on a OneDrive-synced
    // Desktop, and OneDrive's sync engine intermittently locks/moves those
    // files mid-write, corrupting the cache ("os error 3", "Another write
    // batch... already active"). Disabling it trades a bit of rebuild speed
    // for a dev server that doesn't crash.
    turbopackFileSystemCacheForDev: false,
  },
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

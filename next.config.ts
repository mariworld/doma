import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parent repo has its own package-lock.json; without this Turbopack picks the
  // wrong workspace root and resolves modules from namecheap-doma-integration (v1).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@shookuku/content"],
  poweredByHeader: false,
};

export default config;

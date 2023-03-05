// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  redirects: () => {
    return Promise.resolve([
      {
        source: "/",
        destination: "/explore",
        permanent: true,
      },
    ]);
  },
  images: {
    domains: [
      "foyr.com",
      "www.kbhome.com",
      "sbleaping.s3.amazonaws.com",
      "i.imgur.com",
      "cdn-icons-png.flaticon.com",
      "images.pexels.com",
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};
export default config;

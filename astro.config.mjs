import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  integrations: [icon()],
  image: {
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
});

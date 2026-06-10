import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Replace 'streamvault' with your exact GitHub repo name
  base: "/streamvault/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    port: 5173,
  },
});

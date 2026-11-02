import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" membuat aset relatif, sehingga situs jalan di GitHub Pages
// (https://<user>.github.io/<repo>/) tanpa perlu menulis nama repo.
export default defineConfig({
  base: "./",
  plugins: [react()],
});

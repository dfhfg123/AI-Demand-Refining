import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
      customCollections: {
        i: FileSystemIconLoader("./icons/"),
      },
    }),
  ],
  server: { port: 5173, host: true },
});

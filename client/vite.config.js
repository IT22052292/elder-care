import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  server: {
    proxy: {
      "/API": {
        target: "http://localhost:8070",
        
      },
    },
  },
  plugins: [react()],
});

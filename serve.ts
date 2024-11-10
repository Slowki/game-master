import { Hono } from "npm:hono";
import { serveStatic } from "npm:hono/deno";

const app = new Hono();

app.use("*", serveStatic({ root: "./dist" }));
app.on(
  "GET",
  ["/create", "/player/*", "/campaign/*"],
  serveStatic({
    path: "dist/index.html",
  }),
);

Deno.serve(app.fetch);

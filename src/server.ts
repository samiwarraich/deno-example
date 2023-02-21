import { Application, Router } from "./deps.ts";
import type { RouterContext } from "./deps.ts";
import config from "./config/default.ts";
import appRouter from "./routes/index.ts";

const app = new Application();
const router = new Router();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

router.get<string>("/api/healthchecker", (ctx: RouterContext<string>) => {
  ctx.response.status = 200;
  ctx.response.body = "200 | Health Checker";
});

appRouter.init(app);
app.use(router.routes());
app.use(router.allowedMethods());

router.all<string>("/(.*)", (ctx: RouterContext<string>) => {
  ctx.response.status = 404;
  ctx.response.body = "404 | Page not Found";
});

app.addEventListener("listen", ({ port, secure }) => {
  console.log(
    `🚀 Server started on ${secure ? "https://" : "http://"}localhost:${port}`
  );
});

const port = config.port;
app.listen({ port });

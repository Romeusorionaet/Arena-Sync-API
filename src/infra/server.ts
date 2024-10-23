import { app } from "./app";
import { cronJobGetMatch } from "./cron-jobs/cron-job-get-match";
import { env } from "./env";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("► HTTP Server Running! Port:", env.PORT);

    cronJobGetMatch();
  });

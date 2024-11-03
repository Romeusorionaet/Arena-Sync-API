import { app } from "./app";
import { cronJobGetChampionshipMatches } from "./cron-jobs/cron-job-get-champioship";
import { cronJobUpdateMatches } from "./cron-jobs/cron-job-update-matches";
import { env } from "./env";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("► HTTP Server Running! Port:", env.PORT);

    cronJobGetChampionshipMatches();
    cronJobUpdateMatches();

    console.log("Cron-jobs em execução.");
  });

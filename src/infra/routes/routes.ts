import { FastifyInstance } from "fastify";
import { championship } from "../controllers/championship";
import { championshipMatches } from "../controllers/championship-matches";
import { matchDetails } from "../controllers/match-details";

export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championships", championship);
  app.get("/championships/matches", championshipMatches);
  app.get("/match/:matchId", matchDetails);
}

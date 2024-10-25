import { FastifyInstance } from "fastify";
import { championship } from "../controllers/championship";
import { matchDetails } from "../controllers/match-details";
import { searchMatches } from "../controllers/championship-matches";

export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championships", championship);
  app.get("/championships/matches", searchMatches);
  app.get("/match/:matchId", matchDetails);
}

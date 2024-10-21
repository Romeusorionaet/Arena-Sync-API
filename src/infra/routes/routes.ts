import { FastifyInstance } from "fastify";
import { saveChampionshipMatches } from "../controllers/championship-create";

export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championship/matches/save", saveChampionshipMatches);
}

import { FastifyInstance } from "fastify";
import { accessChampionshipMatches } from "../controllers/championship-create";

export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championship/matches/save", accessChampionshipMatches);
}

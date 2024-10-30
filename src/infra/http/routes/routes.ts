import { getAthleteDetails } from "../controllers/get-athlete-details";
import { getTeamDetails } from "../controllers/get-team-details";
import { matchDetails } from "../controllers/match-details";
import { getAthletes } from "../controllers/get-athletes";
import { getTeams } from "../controllers/get-teams";
import { FastifyInstance } from "fastify";
import { searchMatches } from "../controllers/search-matches";
import { getChampionship } from "../controllers/get-championship";
import { getNearestMatches } from "../controllers/get-nearest-matches";

export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championships", getChampionship);

  app.get("/championships/matches", searchMatches);
  app.get("/match/details/:matchId", matchDetails);
  app.get("/nearest-matches", getNearestMatches);

  app.get("/teams", getTeams);
  app.get("/team/details/:teamId", getTeamDetails);

  app.get("/athletes", getAthletes);
  app.get("/athlete/details/:athleteId", getAthleteDetails);
}

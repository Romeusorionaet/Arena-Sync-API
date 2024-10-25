import { FastifyInstance } from "fastify";
import { championship } from "../controllers/championship";
import { matchDetails } from "../controllers/match-details";
import { searchMatches } from "../controllers/championship-matches";
import { getTeams } from "../controllers/get-teams";
import { getTeamDetails } from "../controllers/get-team-details";
import { getAthletes } from "../controllers/get-athletes";
import { getAthleteDetails } from "../controllers/get-athlete-details";

// TODO dividir routas
export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championships", championship);
  app.get("/championships/matches", searchMatches);
  app.get("/match/:matchId", matchDetails);
  app.get("/teams", getTeams);
  app.get("/team/details/:teamId", getTeamDetails);
  app.get("/athletes", getAthletes);
  app.get("/athlete/details/:athleteId", getAthleteDetails);
}

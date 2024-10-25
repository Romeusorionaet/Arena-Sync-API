import { getAthleteDetails } from "../controllers/get-athlete-details";
import { searchMatches } from "../controllers/championship-matches";
import { getTeamDetails } from "../controllers/get-team-details";
import { matchDetails } from "../controllers/match-details";
import { championship } from "../controllers/championship";
import { getAthletes } from "../controllers/get-athletes";
import { getTeams } from "../controllers/get-teams";
import { FastifyInstance } from "fastify";

export async function championshipRoutes(app: FastifyInstance) {
  app.get("/championships", championship);

  app.get("/championships/matches", searchMatches);
  app.get("/match/:matchId", matchDetails);

  app.get("/teams", getTeams);
  app.get("/team/details/:teamId", getTeamDetails);

  app.get("/athletes", getAthletes);
  app.get("/athlete/details/:athleteId", getAthleteDetails);
}

import {
  fetchChampionshipData,
  fetchChampionshipMatches,
} from "../services/soccer-api";
import { upsertChampionship } from "../database/prisma/championship/upsert-championship";
import { championshipSchema } from "../http/schemas/championship-schema";
import { matchesListSchema } from "../http/schemas/matches-list-schema";
import { upsertMatchData } from "../database/prisma/match/upsert-match";
import cron from "node-cron";

export async function cronJobGetChampionshipMatches() {
  const now = new Date();

  if (now.getDate() === 10 && now.getMonth() >= 3 && now.getMonth() <= 10) {
    try {
      const responseChampionship = await fetchChampionshipData();
      const dataChampionship = championshipSchema.parse(responseChampionship);
      const { id: championshipId } = await upsertChampionship(dataChampionship);

      const responseDataMatches = await fetchChampionshipMatches();
      const dataMatchesList = matchesListSchema.parse(responseDataMatches);

      if (
        !dataMatchesList.partidas ||
        !dataMatchesList.partidas["fase-unica"]
      ) {
        return console.log({
          error_code: "INVALID_DATA_STRUCTURE",
          message_error: "Estrutura de dados inesperada da API.",
        });
      }

      const matchesByRounds = dataMatchesList.partidas["fase-unica"];
      const allMatches = Object.values(matchesByRounds).flat();

      await upsertMatchData(allMatches, championshipId);

      console.log(
        "Cron-Job Get Championship Matches, foi execultado com sucesso: ",
        now,
      );
    } catch (error) {
      console.error("Erro ao monitorar partidas:", error);
    }
  }
}

cron.schedule("* * 10 4-11 *", cronJobGetChampionshipMatches, {
  timezone: "America/Sao_Paulo",
  runOnInit: false,
  recoverMissedExecutions: true,
});

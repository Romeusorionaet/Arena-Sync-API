import cron from "node-cron";
import {
  fetchChampionshipData,
  fetchChampionshipMatches,
} from "../services/soccer-api";
import { championshipSchema } from "../http/schemas/championship-schema";
import {
  upsertChampionship,
  upsertMatchData,
} from "../database/prisma/prisma-championship-service-repository";
import { matchesListSchema } from "../http/schemas/matches-list-schema";

export async function cronJobGetChampionshipMatches() {
  try {
    const responseChampionship = await fetchChampionshipData();
    const dataChampionship = championshipSchema.parse(responseChampionship);
    const { id: championshipId } = await upsertChampionship(dataChampionship);

    const responseDataMatches = await fetchChampionshipMatches();
    const dataMatchesList = matchesListSchema.parse(responseDataMatches);

    if (!dataMatchesList.partidas || !dataMatchesList.partidas["fase-unica"]) {
      return console.log({
        error_code: "INVALID_DATA_STRUCTURE",
        message_error: "Estrutura de dados inesperada da API.",
      });
    }

    const matchesByRounds = dataMatchesList.partidas["fase-unica"];
    const allMatches = Object.values(matchesByRounds).flat();

    await upsertMatchData(allMatches, championshipId);
  } catch (error) {
    console.error("Erro ao monitorar partidas:", error);
  }
}

cron.schedule("* * 10 4-11 *", cronJobGetChampionshipMatches);

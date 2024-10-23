import cron from "node-cron";
import { fetchMatch } from "../services/soccer-api";

import {
  findByNearestDateAndTime,
  saveTeamData,
} from "../database/prisma/prisma-matche-repository";
import { matchDataSchema } from "../schemas/match-data-schema";

export async function cronJobGetMatch() {
  try {
    const matchIdList = await findByNearestDateAndTime();

    if (matchIdList.length === 0) {
      return;
    }

    for (const match of matchIdList) {
      try {
        const matchData = await fetchMatch({ matchId: match.id });

        const data = matchDataSchema.parse(matchData);

        await Promise.all([
          saveTeamData({ type: "mandante", matchData: data }),
          saveTeamData({ type: "visitante", matchData: data }),
        ]);
      } catch (error) {
        console.error(`Erro ao buscar dados da partida`, error);
      }
    }
  } catch (error) {
    console.error("Erro ao monitorar partidas:", error);
  }
}

cron.schedule("0 1 * * *", cronJobGetMatch);
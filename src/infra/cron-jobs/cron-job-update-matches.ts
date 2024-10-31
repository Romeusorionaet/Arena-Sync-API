import { findMatchesByNearestDateAndTime } from "../database/prisma/match/find-matches-by-nearest-date-and-time";
import { saveMatchDetails } from "../database/prisma/match/save-match-details";
import { matchDataSchema } from "../http/schemas/match-data-schema";
import { fetchMatch } from "../services/soccer-api";
import cron from "node-cron";

export async function cronJobUpdateMatches() {
  const now = new Date();

  if (
    now.getHours() === 1 &&
    now.getMinutes() === 0 &&
    now.getMonth() >= 3 &&
    now.getMonth() <= 11
  ) {
    try {
      const matchIdList = await findMatchesByNearestDateAndTime();

      if (matchIdList.length === 0) {
        return;
      }

      for (const match of matchIdList) {
        try {
          const matchData = await fetchMatch({ matchId: match.id });

          const data = matchDataSchema.parse(matchData);

          await Promise.all([
            saveMatchDetails({ type: "mandante", matchData: data }),
            saveMatchDetails({ type: "visitante", matchData: data }),
          ]);

          console.log(
            "Cron-Job Update Matches foi execultado com sucesso: ",
            now,
          );
        } catch (error) {
          console.error(`Erro ao buscar dados da partida`, error);
        }
      }
    } catch (error) {
      console.error("Erro ao monitorar partidas:", error);
    }
  }
}

cron.schedule("0 1 * 4-12 *", cronJobUpdateMatches);

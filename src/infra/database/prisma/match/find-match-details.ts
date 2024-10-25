import { prisma } from "src/infra/services/prisma";
import { Prisma } from "@prisma/client";

export async function findMatchDetails(
  id: string,
): Promise<Prisma.PartidaCreateManyInput | null> {
  const match = await prisma.partida.findUnique({
    where: {
      id,
    },
    include: {
      timeMandante: {
        include: {
          estatisticaDaPartida: {
            include: {
              cartao: {
                include: {
                  atleta: true,
                },
              },
              gol: {
                include: {
                  atleta: true,
                },
              },
              finalizacao: true,
              passe: true,
              substituicao: {
                include: {
                  entrouAtleta: true,
                  saiuAtleta: true,
                },
              },
            },
          },
          Escalacao: {
            include: {
              reserva: {
                include: {
                  atleta: true,
                },
              },
              titular: {
                include: {
                  atleta: true,
                },
              },
            },
          },
        },
      },
      timeVisitante: {
        include: {
          estatisticaDaPartida: {
            include: {
              cartao: {
                include: {
                  atleta: true,
                },
              },
              gol: {
                include: {
                  atleta: true,
                },
              },
              finalizacao: true,
              passe: true,
              substituicao: {
                include: {
                  entrouAtleta: true,
                  saiuAtleta: true,
                },
              },
            },
          },
          Escalacao: {
            include: {
              reserva: {
                include: {
                  atleta: true,
                },
              },
              titular: {
                include: {
                  atleta: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return match || null;
}

import { prisma } from "src/infra/services/prisma";

export async function findAthleteDetails(id: string) {
  const athlete = await prisma.atleta.findUnique({
    where: {
      id,
    },
    select: {
      nomePopular: true,
      cartao: {
        select: {
          cor: true,
        },
      },
      gol: {
        select: {
          gol_contra: true,
          penalti: true,
        },
      },
      titular: {
        select: {
          camisa: true,
          posicao: true,
          escalacao: {
            select: {
              time: {
                select: {
                  nome: true,
                  escudo: true,
                },
              },
            },
          },
        },
      },
      reserva: {
        select: {
          camisa: true,
          posicao: true,
          escalacao: {
            select: {
              time: {
                select: {
                  nome: true,
                  escudo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return athlete || null;
}

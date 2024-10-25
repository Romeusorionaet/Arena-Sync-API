import { prisma } from "src/infra/services/prisma";

export async function findTeamDetails(id: string) {
  const team = await prisma.time.findUnique({
    where: {
      id,
    },
    select: {
      escudo: true,
      nome: true,
      sigla: true,
      estatisticaDaPartida: {
        select: {
          defesas: true,
          escanteios: true,
          desarmes: true,
          faltas: true,
          posseDeBola: true,
          impedimentos: true,
          finalizacao: {
            select: {
              naTrave: true,
              bloqueio: true,
              noGol: true,
              praFora: true,
              precisao: true,
              total: true,
            },
          },
          passe: {
            select: {
              completos: true,
              errados: true,
              precisao: true,
              total: true,
            },
          },
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
        },
      },
    },
  });

  return team || null;
}

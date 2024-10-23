import dayjs from "dayjs";
import { matchDataSchema } from "src/infra/schemas/match-data-schema";
import { prisma } from "src/infra/services/prisma";
import { z } from "zod";

export async function findByNearestDateAndTime(): Promise<{ id: string }[]> {
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const data = await prisma.partida.findMany({
    where: {
      status: "finalizado",
      dataRealizacaoIso: {
        gte: `${yesterday}T00:00:00`,
        lt: `${yesterday}T23:59:59`,
      },
    },
    select: {
      id: true,
    },
  });

  if (!data) {
    return [];
  }

  return data;
}

type MatchData = z.infer<typeof matchDataSchema>;

interface SaveTeamDataProps {
  type: "mandante" | "visitante";
  matchData: MatchData;
}

export async function saveTeamData({
  type,
  matchData,
}: SaveTeamDataProps): Promise<void> {
  const parsedMatchData = matchDataSchema.parse(matchData);
  const time = parsedMatchData[`time_${type}`];
  const escalacao = parsedMatchData.escalacoes[type];
  const estatisticas = parsedMatchData.estatisticas[type];
  const gols = parsedMatchData.gols[type];
  const cartoesAmarelos = parsedMatchData.cartoes.amarelo[type];
  const cartoesVermelhos = parsedMatchData.cartoes.vermelho[type];
  const substituicoes = parsedMatchData.substituicoes[type];

  await prisma.partida.update({
    where: {
      id: parsedMatchData.partida_id.toString(),
    },
    data: {
      placar: parsedMatchData.placar,
      status: parsedMatchData.status,
      estadio: parsedMatchData.estadio.nome_popular,
      placarMandante: parsedMatchData.placar_mandante,
      placarVisitante: parsedMatchData.placar_visitante,
    },
  });

  const escalacaoSalva = await prisma.escalacao.create({
    data: {
      partidaId: parsedMatchData.partida_id.toString(),
      esquemaTatico: escalacao.esquema_tatico,
      tecnico: escalacao.tecnico.nome_popular,
      timeId: time.time_id.toString(),
    },
  });

  await Promise.all(
    escalacao.titulares.map(async (titular) => {
      await prisma.atleta.upsert({
        where: { id: titular.atleta.atleta_id.toString() },
        update: {},
        create: {
          id: titular.atleta.atleta_id.toString(),
          nomePopular: titular.atleta.nome_popular,
        },
      });

      await prisma.titular.create({
        data: {
          escalacaoId: escalacaoSalva.id,
          atletaId: titular.atleta.atleta_id.toString(),
          camisa: titular.camisa,
          posicao: Array.isArray(titular.posicao)
            ? ""
            : titular.posicao?.nome || "",
        },
      });
    }),
  );

  await Promise.all(
    escalacao.reservas.map(async (reserva) => {
      await prisma.atleta.upsert({
        where: { id: reserva.atleta.atleta_id.toString() },
        update: {},
        create: {
          id: reserva.atleta.atleta_id.toString(),
          nomePopular: reserva.atleta.nome_popular,
        },
      });

      await prisma.reserva.create({
        data: {
          escalacaoId: escalacaoSalva.id,
          atletaId: reserva.atleta.atleta_id.toString(),
          camisa: reserva.camisa,
          posicao: Array.isArray(reserva.posicao)
            ? ""
            : reserva.posicao?.nome || "",
        },
      });
    }),
  );

  const estatisticaSalva = await prisma.estatisticaDaPartida.create({
    data: {
      partidaId: parsedMatchData.partida_id.toString(),
      timeId: time.time_id.toString(),
      posseDeBola: estatisticas.posse_de_bola,
      escanteios: estatisticas.escanteios,
      impedimentos: estatisticas.impedimentos,
      faltas: estatisticas.faltas,
      defesas: estatisticas.defensivo.defesas,
      desarmes: estatisticas.desarmes,
      passe: {
        create: {
          total: estatisticas.passes.total,
          completos: estatisticas.passes.completos,
          errados: estatisticas.passes.errados,
          precisao: estatisticas.passes.precisao,
        },
      },
      finalizacao: {
        create: {
          total: estatisticas.finalizacao.total,
          bloqueio: estatisticas.finalizacao.bloqueado,
          naTrave: estatisticas.finalizacao.na_trave,
          noGol: estatisticas.finalizacao.no_gol,
          praFora: estatisticas.finalizacao.pra_fora,
          precisao: estatisticas.finalizacao.precisao,
        },
      },
    },
  });

  if (gols.length > 0) {
    await Promise.all(
      gols.map(async (gol) => {
        await prisma.gol.create({
          data: {
            estatisticaDaPartidaId: estatisticaSalva.id,
            atletaId: gol.atleta.atleta_id.toString(),
            minuto: gol.minuto,
            periodo: gol.periodo,
            gol_contra: gol.gol_contra,
            penalti: gol.penalti,
          },
        });
      }),
    );
  }

  enum CoresDoCartao {
    VERMELHO = "VERMELHO",
    AMARELO = "AMARELO",
  }

  const salvarCartoes = async (cartoes: any[], cor?: CoresDoCartao) => {
    if (cartoes.length > 0) {
      await Promise.all(
        cartoes.map(async (cartao: any) => {
          await prisma.cartao.create({
            data: {
              atletaId: cartao.atleta.atleta_id.toString(),
              estatisticaDaPartidaId: estatisticaSalva.id,
              minuto: cartao.minuto,
              periodo: cartao.periodo,
              cor,
            },
          });
        }),
      );
    }
  };

  await salvarCartoes(cartoesAmarelos, CoresDoCartao.AMARELO);
  await salvarCartoes(cartoesVermelhos, CoresDoCartao.VERMELHO);

  if (substituicoes.length > 0) {
    await Promise.all(
      substituicoes.map(async (substituicao) => {
        await prisma.substituicao.create({
          data: {
            estatisticaDaPartidaId: estatisticaSalva.id,
            timeId: time.time_id.toString(),
            minuto: substituicao.minuto,
            entrou: substituicao.entrou.atleta_id.toString(),
            saiu: substituicao.saiu.atleta_id.toString(),
            periodo: substituicao.periodo,
          },
        });
      }),
    );
  }
}

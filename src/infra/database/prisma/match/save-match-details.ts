import { matchDataSchema } from "src/infra/http/schemas/match-data-schema";
import { prisma } from "src/infra/services/prisma";
import { z } from "zod";

type MatchData = z.infer<typeof matchDataSchema>;

interface SaveTeamDataProps {
  type: "mandante" | "visitante";
  matchData: MatchData;
}

export async function saveMatchDetails({
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
            atletaId: gol.atleta ? gol.atleta.atleta_id.toString() : null,
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

  interface CartaoProps {
    atleta: {
      atleta_id: number;
    } | null;
    minuto?: string;
    periodo: string;
  }

  const salvarCartoes = async (cartoes: CartaoProps[], cor?: CoresDoCartao) => {
    if (cartoes.length > 0) {
      await Promise.all(
        cartoes.map(async (cartao) => {
          await prisma.cartao.create({
            data: {
              atletaId: cartao.atleta
                ? cartao.atleta.atleta_id.toString()
                : null,
              estatisticaDaPartidaId: estatisticaSalva.id,
              minuto: cartao.minuto ?? "",
              periodo: cartao.periodo,
              cor,
            },
          });
        }),
      );
    }
  };

  await Promise.all([
    await salvarCartoes(cartoesAmarelos, CoresDoCartao.AMARELO),
    await salvarCartoes(cartoesVermelhos, CoresDoCartao.VERMELHO),
  ]);

  if (substituicoes.length > 0) {
    await Promise.all(
      substituicoes.map(async (substituicao) => {
        await prisma.substituicao.create({
          data: {
            estatisticaDaPartidaId: estatisticaSalva.id,
            timeId: time.time_id.toString(),
            minuto: substituicao.minuto,
            entrouAtletaId: substituicao.entrou.atleta_id.toString(),
            saiuAtletaId: substituicao.saiu.atleta_id.toString(),
            periodo: substituicao.periodo,
          },
        });
      }),
    );
  }
}

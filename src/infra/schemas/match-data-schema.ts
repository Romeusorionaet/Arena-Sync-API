import { boolean, z } from "zod";

const teamSchema = z.object({
  time_id: z.coerce.number(),
  sigla: z.string(),
  nome_popular: z.string(),
  escudo: z.string(),
});

const escalacaoSchema = z.object({
  esquema_tatico: z.string(),
  tecnico: z.object({
    nome_popular: z.string(),
  }),
  titulares: z.array(
    z.object({
      atleta: z.object({
        atleta_id: z.coerce.number(),
        nome_popular: z.string(),
      }),
      camisa: z.string(),
      posicao: z
        .union([z.object({ nome: z.string() }), z.array(z.any())])
        .optional(),
    }),
  ),
  reservas: z.array(
    z.object({
      atleta: z.object({
        atleta_id: z.coerce.number(),
        nome_popular: z.string(),
      }),
      camisa: z.string(),
      posicao: z
        .union([z.object({ nome: z.string() }), z.array(z.any())])
        .optional(),
    }),
  ),
});

const estatisticasSchema = z.object({
  posse_de_bola: z.string(),
  escanteios: z.coerce.number(),
  impedimentos: z.coerce.number(),
  faltas: z.coerce.number(),
  desarmes: z.coerce.number(),
  defensivo: z.object({ defesas: z.coerce.number() }),
  finalizacao: z.object({
    total: z.coerce.number(),
    no_gol: z.coerce.number(),
    na_trave: z.coerce.number(),
    pra_fora: z.coerce.number(),
    bloqueado: z.coerce.number(),
    precisao: z.string(),
  }),
  passes: z.object({
    total: z.coerce.number(),
    completos: z.coerce.number(),
    errados: z.coerce.number(),
    precisao: z.string(),
  }),
});

const golsSchema = z.object({
  atleta: z.object({ atleta_id: z.coerce.number(), nome_popular: z.string() }),
  minuto: z.string(),
  periodo: z.string(),
  penalti: z.boolean(),
  gol_contra: boolean(),
});

export const cartoesSchema = z.object({
  amarelo: z.object({
    mandante: z.array(
      z.object({
        atleta: z.object({ atleta_id: z.coerce.number() }),
        minuto: z.string().optional(),
        periodo: z.string(),
      }),
    ),
    visitante: z.array(
      z.object({
        atleta: z.object({ atleta_id: z.coerce.number() }),
        minuto: z.string().optional(),
        periodo: z.string(),
      }),
    ),
  }),
  vermelho: z.object({
    mandante: z.array(
      z.object({
        atleta: z.object({ atleta_id: z.coerce.number() }),
        minuto: z.string().optional(),
        periodo: z.string(),
      }),
    ),
    visitante: z.array(
      z.object({
        atleta: z.object({ atleta_id: z.coerce.number() }),
        minuto: z.string().optional(),
        periodo: z.string(),
      }),
    ),
  }),
});

const substituicoesSchema = z.object({
  mandante: z.array(
    z.object({
      periodo: z.string(),
      minuto: z.string().nullable(),
      saiu: z.object({
        atleta_id: z.coerce.number(),
      }),
      entrou: z.object({
        atleta_id: z.coerce.number(),
      }),
    }),
  ),
  visitante: z.array(
    z.object({
      periodo: z.string(),
      minuto: z.string().nullable(),
      saiu: z.object({
        atleta_id: z.coerce.number(),
      }),
      entrou: z.object({
        atleta_id: z.coerce.number(),
      }),
    }),
  ),
});

export const matchDataSchema = z.object({
  partida_id: z.coerce.number(),
  time_mandante: teamSchema,
  time_visitante: teamSchema,
  placar: z.string(),
  placar_mandante: z.coerce.number(),
  placar_visitante: z.coerce.number(),
  status: z.string(),
  estadio: z.object({
    nome_popular: z.string(),
  }),
  escalacoes: z.object({
    mandante: escalacaoSchema,
    visitante: escalacaoSchema,
  }),
  estatisticas: z.object({
    mandante: estatisticasSchema,
    visitante: estatisticasSchema,
  }),
  gols: z.object({
    mandante: z.array(golsSchema),
    visitante: z.array(golsSchema),
  }),
  cartoes: cartoesSchema,
  substituicoes: substituicoesSchema,
});

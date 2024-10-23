-- CreateEnum
CREATE TYPE "CoresDoCartao" AS ENUM ('VERMELHO', 'AMARELO');

-- CreateTable
CREATE TABLE "atletas" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "nome_popular" TEXT NOT NULL,
    "posicao" TEXT,

    CONSTRAINT "atletas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "times" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "escudo" TEXT NOT NULL,

    CONSTRAINT "times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campeonatos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "temporada" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "rodada_atual" INTEGER NOT NULL,

    CONSTRAINT "Campeonatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" TEXT NOT NULL,
    "placar" TEXT,
    "status" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "data_realizacao_iso" TEXT NOT NULL,
    "time_mandante_id" TEXT NOT NULL,
    "time_visitante_id" TEXT NOT NULL,
    "placar_mandante_id" INTEGER,
    "placar_visitante_id" INTEGER,
    "estadio" TEXT,
    "campeonato_id" TEXT NOT NULL,

    CONSTRAINT "partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estatistica_das_partidas" (
    "id" TEXT NOT NULL,
    "posse_de_bola" TEXT NOT NULL,
    "escanteios" INTEGER NOT NULL,
    "impedimentos" INTEGER NOT NULL,
    "faltas" INTEGER NOT NULL,
    "defesas" INTEGER NOT NULL,
    "desarmes" INTEGER NOT NULL,
    "partida_id" TEXT NOT NULL,
    "time_id" TEXT NOT NULL,

    CONSTRAINT "estatistica_das_partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartoes" (
    "id" TEXT NOT NULL,
    "cor" "CoresDoCartao",
    "minuto" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "estatistica_da_partida" TEXT NOT NULL,
    "atleta_id" TEXT NOT NULL,

    CONSTRAINT "cartoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gols" (
    "id" TEXT NOT NULL,
    "minuto" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "penalti" BOOLEAN NOT NULL,
    "gol_contra" BOOLEAN NOT NULL,
    "estatistica_da_partida" TEXT NOT NULL,
    "atleta_id" TEXT NOT NULL,

    CONSTRAINT "gols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passes" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "completos" INTEGER NOT NULL,
    "errados" INTEGER NOT NULL,
    "precisao" TEXT NOT NULL,
    "estatistica_da_partida" TEXT NOT NULL,

    CONSTRAINT "passes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finalizacoes" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "no_gol" INTEGER NOT NULL,
    "pra_fora" INTEGER NOT NULL,
    "na_trave" INTEGER NOT NULL,
    "bloqueio" INTEGER NOT NULL,
    "precisao" TEXT NOT NULL,
    "estatistica_da_partida" TEXT NOT NULL,

    CONSTRAINT "finalizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalacoes" (
    "id" TEXT NOT NULL,
    "time_id" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL,
    "esquema_tatico" TEXT NOT NULL,
    "partida_id" TEXT NOT NULL,

    CONSTRAINT "escalacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titulares" (
    "id" TEXT NOT NULL,
    "atleta_id" TEXT NOT NULL,
    "posicao" TEXT,
    "camisa" TEXT NOT NULL,
    "escalacaoId" TEXT NOT NULL,

    CONSTRAINT "titulares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "atleta_id" TEXT NOT NULL,
    "posicao" TEXT,
    "camisa" TEXT NOT NULL,
    "escalacaoId" TEXT NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substituicoes" (
    "id" TEXT NOT NULL,
    "time_id" TEXT NOT NULL,
    "entrou" TEXT NOT NULL,
    "saiu" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "minuto" TEXT,
    "estatisticaDaPartidaId" TEXT NOT NULL,

    CONSTRAINT "substituicoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campeonatos_temporada_key" ON "Campeonatos"("temporada");

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_campeonato_id_fkey" FOREIGN KEY ("campeonato_id") REFERENCES "Campeonatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatistica_das_partidas" ADD CONSTRAINT "estatistica_das_partidas_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatistica_das_partidas" ADD CONSTRAINT "estatistica_das_partidas_time_id_fkey" FOREIGN KEY ("time_id") REFERENCES "times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartoes" ADD CONSTRAINT "cartoes_estatistica_da_partida_fkey" FOREIGN KEY ("estatistica_da_partida") REFERENCES "estatistica_das_partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartoes" ADD CONSTRAINT "cartoes_atleta_id_fkey" FOREIGN KEY ("atleta_id") REFERENCES "atletas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gols" ADD CONSTRAINT "gols_estatistica_da_partida_fkey" FOREIGN KEY ("estatistica_da_partida") REFERENCES "estatistica_das_partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gols" ADD CONSTRAINT "gols_atleta_id_fkey" FOREIGN KEY ("atleta_id") REFERENCES "atletas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_estatistica_da_partida_fkey" FOREIGN KEY ("estatistica_da_partida") REFERENCES "estatistica_das_partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finalizacoes" ADD CONSTRAINT "finalizacoes_estatistica_da_partida_fkey" FOREIGN KEY ("estatistica_da_partida") REFERENCES "estatistica_das_partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes" ADD CONSTRAINT "escalacoes_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulares" ADD CONSTRAINT "titulares_escalacaoId_fkey" FOREIGN KEY ("escalacaoId") REFERENCES "escalacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_escalacaoId_fkey" FOREIGN KEY ("escalacaoId") REFERENCES "escalacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substituicoes" ADD CONSTRAINT "substituicoes_estatisticaDaPartidaId_fkey" FOREIGN KEY ("estatisticaDaPartidaId") REFERENCES "estatistica_das_partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

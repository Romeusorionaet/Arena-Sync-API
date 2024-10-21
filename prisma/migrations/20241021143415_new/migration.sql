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
CREATE TABLE "times" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "escudo" TEXT NOT NULL,

    CONSTRAINT "times_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campeonatos_temporada_key" ON "Campeonatos"("temporada");

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_campeonato_id_fkey" FOREIGN KEY ("campeonato_id") REFERENCES "Campeonatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

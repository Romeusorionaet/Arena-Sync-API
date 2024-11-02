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
        select: {
          nome: true,
          sigla: true,
          escudo: true,
          estatisticaDaPartida: {
            where: { partidaId: id },
            select: {
              defesas: true,
              desarmes: true,
              escanteios: true,
              faltas: true,
              posseDeBola: true,
              impedimentos: true,
              cartao: {
                select: {
                  cor: true,
                  minuto: true,
                  periodo: true,
                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      titular: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                      reserva: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          posicao: true,
                          camisa: true,
                        },
                      },
                    },
                  },
                },
              },
              gol: {
                select: {
                  minuto: true,
                  periodo: true,
                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      titular: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                      reserva: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          posicao: true,
                          camisa: true,
                        },
                      },
                    },
                  },
                },
              },
              finalizacao: {
                select: {
                  bloqueio: true,
                  naTrave: true,
                  noGol: true,
                  praFora: true,
                  precisao: true,
                  total: true,
                },
              },
              passe: {
                select: {
                  total: true,
                  completos: true,
                  errados: true,
                  precisao: true,
                },
              },
              substituicao: {
                select: {
                  periodo: true,
                  minuto: true,
                  entrouAtleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      reserva: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                    },
                  },
                  saiuAtleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      titular: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          escalacao: {
            where: { partidaId: id },
            select: {
              tecnico: true,
              esquemaTatico: true,
              reserva: {
                select: {
                  camisa: true,
                  posicao: true,
                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                    },
                  },
                },
              },
              titular: {
                select: {
                  camisa: true,
                  posicao: true,

                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      timeVisitante: {
        select: {
          nome: true,
          sigla: true,
          escudo: true,
          estatisticaDaPartida: {
            where: { partidaId: id },
            select: {
              id: true,
              defesas: true,
              desarmes: true,
              escanteios: true,
              faltas: true,
              posseDeBola: true,
              impedimentos: true,
              cartao: {
                select: {
                  cor: true,
                  minuto: true,
                  periodo: true,
                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      titular: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                      reserva: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          posicao: true,
                          camisa: true,
                        },
                      },
                    },
                  },
                },
              },
              gol: {
                select: {
                  minuto: true,
                  periodo: true,
                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      titular: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                      reserva: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          posicao: true,
                          camisa: true,
                        },
                      },
                    },
                  },
                },
              },
              finalizacao: {
                select: {
                  bloqueio: true,
                  naTrave: true,
                  noGol: true,
                  praFora: true,
                  precisao: true,
                  total: true,
                },
              },
              passe: {
                select: {
                  total: true,
                  completos: true,
                  errados: true,
                  precisao: true,
                },
              },
              substituicao: {
                select: {
                  periodo: true,
                  minuto: true,
                  entrouAtleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      reserva: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                    },
                  },
                  saiuAtleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                      titular: {
                        where: {
                          escalacao: {
                            partidaId: id,
                          },
                        },
                        select: {
                          camisa: true,
                          posicao: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          escalacao: {
            where: { partidaId: id },
            select: {
              tecnico: true,
              esquemaTatico: true,
              reserva: {
                select: {
                  camisa: true,
                  posicao: true,

                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                    },
                  },
                },
              },
              titular: {
                select: {
                  camisa: true,
                  posicao: true,

                  atleta: {
                    select: {
                      id: true,
                      nomePopular: true,
                    },
                  },
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

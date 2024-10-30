import { Prisma } from ".prisma/client";

export function createSlugFilter(
  team1?: string,
  team2?: string,
): Prisma.PartidaWhereInput {
  if (team1 && team2) {
    return {
      OR: [
        {
          AND: [
            {
              slug: {
                contains: team1,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              slug: {
                contains: team2,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        },
        {
          AND: [
            {
              slug: {
                contains: team2,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              slug: {
                contains: team1,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        },
      ],
    };
  } else if (team1 || team2) {
    const team = team1 || team2;
    return {
      slug: {
        contains: team,
        mode: "insensitive" as Prisma.QueryMode,
      },
    };
  }
  return {};
}

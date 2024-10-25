import { Prisma } from ".prisma/client";

export function createSlugFilter(
  team1?: string,
  team2?: string,
): Prisma.PartidaWhereInput {
  if (team1 && team2) {
    return {
      OR: [
        {
          slug: {
            contains: `${team1}-${team2}`,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
        {
          slug: {
            contains: `${team2}-${team1}`,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
      ],
    };
  } else if (team1 || team2) {
    const team = team1 || team2;
    return {
      slug: { contains: `${team}-`, mode: "insensitive" as Prisma.QueryMode },
    };
  }
  return {};
}

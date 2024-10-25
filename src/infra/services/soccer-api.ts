import { env } from "../env";
import axios from "axios";

export async function fetchChampionshipData() {
  const response = await axios.get(
    "https://api.api-futebol.com.br/v1/campeonatos/10",
    {
      headers: {
        Authorization: `Bearer ${env.SOCCER_API_KEY}`,
      },
    },
  );
  return response.data;
}

export async function fetchChampionshipMatches() {
  const response = await fetch(
    "https://api.api-futebol.com.br/v1/campeonatos/10/partidas",
    {
      headers: {
        Authorization: `Bearer ${env.SOCCER_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar partidas: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchMatch({ matchId }: { matchId: string }) {
  const response = await axios.get(
    `https://api.api-futebol.com.br/v1/partidas/${matchId}`,
    {
      headers: {
        Authorization: `Bearer ${env.SOCCER_API_KEY}`,
      },
    },
  );
  return response.data;
}

import type { PlaylistMood } from '../../db/db';

/**
 * No Spotify OAuth needed: the public embed iframe plays any playlist by ID
 * without login. These defaults are well-known public Spotify editorial
 * playlists — placeholders, not personalized. Swap them from the Música tab
 * (paste a playlist link) for playlists that actually match her taste; real
 * taste-based recommendations would need Spotify OAuth (Phase 2).
 */
export const DEFAULT_PLAYLISTS: Record<PlaylistMood, { title: string; blurb: string; id: string }> = {
  enfoque: {
    title: 'Enfoque / Estudio',
    blurb: 'Para acompañar sesiones de estudio o tareas grandes.',
    id: '37i9dQZF1DWZeKCadgRdKQ', // Deep Focus
  },
  feliz: {
    title: 'Feliz / Hype',
    blurb: 'Para subir el ánimo cuando quieras energía.',
    id: '37i9dQZF1DX3rxVfibe1L0', // Mood Booster
  },
  calma: {
    title: 'Calma / Ansiedad',
    blurb: 'Para bajar revoluciones cuando el día pesa.',
    id: '37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
  },
};

export function extractSpotifyPlaylistId(input: string): string | null {
  const trimmed = input.trim();
  const uriMatch = trimmed.match(/spotify:playlist:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];
  const urlMatch = trimmed.match(/playlist\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[a-zA-Z0-9]{10,}$/.test(trimmed)) return trimmed;
  return null;
}

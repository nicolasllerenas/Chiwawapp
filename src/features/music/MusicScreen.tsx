import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type PlaylistMood } from '../../db/db';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { DEFAULT_PLAYLISTS, extractSpotifyPlaylistId } from './playlists';
import { SpotifyEmbed } from './components/SpotifyEmbed';

const MOODS: PlaylistMood[] = ['enfoque', 'feliz', 'calma'];

export function MusicScreen() {
  const [activeMood, setActiveMood] = useState<PlaylistMood>('enfoque');
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const settings = useLiveQuery(() => db.settings.get('singleton'), []);
  const overrideId = settings?.playlistOverrides?.[activeMood];
  const playlist = DEFAULT_PLAYLISTS[activeMood];
  const playlistId = overrideId ?? playlist.id;

  async function saveOverride() {
    const id = extractSpotifyPlaylistId(urlInput);
    if (!id || !settings) return;
    await db.settings.update('singleton', {
      playlistOverrides: { ...settings.playlistOverrides, [activeMood]: id },
    });
    setUrlInput('');
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold text-ink">Música</h1>

      <div className="flex gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => {
              setActiveMood(mood);
              setEditing(false);
            }}
            className={`flex-1 rounded-2xl border py-2.5 text-sm font-bold capitalize ${
              activeMood === mood ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-ink-soft'
            }`}
          >
            {DEFAULT_PLAYLISTS[mood].title}
          </button>
        ))}
      </div>

      <Card className="text-sm text-ink-soft">{playlist.blurb}</Card>

      <SpotifyEmbed playlistId={playlistId} />

      <p className="text-xs text-ink-faint">Necesitas internet para escuchar música aquí.</p>

      {!editing ? (
        <button type="button" onClick={() => setEditing(true)} className="text-sm font-bold text-primary">
          ✏️ Cambiar esta playlist
        </button>
      ) : (
        <Card className="flex flex-col gap-2">
          <p className="text-sm font-bold text-ink-soft">Pega el link de una playlist de Spotify</p>
          <input
            autoFocus
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="flex-1">
              Cancelar
            </Button>
            <Button size="sm" onClick={saveOverride} className="flex-1">
              Guardar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

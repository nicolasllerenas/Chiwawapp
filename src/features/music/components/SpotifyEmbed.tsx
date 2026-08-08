export function SpotifyEmbed({ playlistId }: { playlistId: string }) {
  return (
    <iframe
      key={playlistId}
      title="Spotify playlist"
      style={{ borderRadius: 16 }}
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
      width="100%"
      height="352"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}

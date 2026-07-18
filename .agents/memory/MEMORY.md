# Memory Index

- [Logo & favicon assets](logo-favicon-assets.md) — official logo has "Puro" overlapping "DETALLE" so letter crops fail; favicon is a generated Kaushan "P" monogram, not a crop.
- [Alpha cleanup after bg removal](logo-favicon-assets.md) — bg removal leaves faint alpha junk visible on tinted bgs; clean with `-channel A -level 15%,100%`, verify on a flat color.
- [Logo glint & thin-detail recovery](logo-favicon-assets.md) — AI bg removal eats thin speed lines (recover via corner-floodfill hybrid); never `mask-image: url()` for glints — use clip-path'd img copy.

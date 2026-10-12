# 3D Asset - Virtual Town

Interactive 1-player 3D exploration game built with Three.js.

## Layout (based on sketch)

- **North**: Goat Trading Station (10 trading seats/desks), Prop Firm Shop (catalogue), Open Garden, Restaurant
- Roads separating sections
- **Middle**: House, Hotel, Church, Coffee Shop, Mosque
- **South**: Car Dealer Shop, House Equipment Shop
- **Bottom**: Estates with 36 houses (6x6 grid)

## Features

- First-person controls (WASD + mouse look, click to lock pointer)
- Real exteriors and basic interiors for all buildings
- Goat: 10 seater trading station with desks, chairs, monitors
- Prop Shop: 3D catalogue of Goat Funded Trader accounts (from goatfundedtrader.com data), with prices, descriptions, add to cart, and real purchase links (opens official site/checkout)
- Interactive: Press E near account cards or cart desk
- Other buildings with furniture, cars, trees, etc.

## How to Run

1. Serve the directory locally (required for ES modules):
   ```bash
   npx serve .
   # or python -m http.server 8000
   ```
2. Open http://localhost:8000 (or equivalent) in a modern browser.
3. Click to start, explore the town.

Prices are approximate based on public data as of Oct 2026; always verify current prices and terms on https://goatfundedtrader.com before purchasing.

## Tech

- Three.js r169 via CDN
- PointerLockControls
- No external assets (procedural geometry)

Built as a complete, functional 3D virtual environment matching the provided sketch.

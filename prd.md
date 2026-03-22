# scorbie - product requirements document (prd)

## 1. overview
**scorbie** is a simple, modern, and responsive web-based badminton scoreboard application. it allows users to track scores, manage serving sides, and enforce standard badminton rules like deuce and the skunk rule.

## 2. target audience
- casual badminton players who need a quick way to keep track of scores.
- referees or umpires in local tournaments.

## 3. core features
- **score tracking:** tap to increment or decrement scores for two teams.
- **editable team names:** inline name editing directly on the main screen.
- **swap teams:** swap left/right team positions along with all associated state.
- **serving logic:** visually indicates which side (left/right) should serve based on the serving team's current score (even = serve right, odd = serve left). togglable.
- **deuce rule:** when both teams reach `target score - 1` (e.g., 20-20), a team must win by 2 points. togglable.
- **skunk rule:** if a team reaches 3-0, the game ends immediately. togglable.
- **doubles mode:** each team has 2 players represented by unique emojis. players can be swapped manually, or auto-swapped when the serving team scores a point.
- **emoji picker:** each player slot has a picker that enforces uniqueness across all 4 player slots.
- **theme presets:** 17 color themes applied dynamically via css variables.
- **sound effects:** synthesized audio via web audio api — short tone on score, fanfare on win.
- **game reset:** quickly reset scores, players, and serving state to start a new game.

## 4. user interface
- **mobile-first design:** optimized for touch devices with large, easy-to-tap score areas; supports both portrait and landscape orientation.
- **clear visual feedback:** distinct colors per team, deuce amber tint, winner overlay with animated card, and serving indicators with ring/scale emphasis.
- **settings modal:** configure target score (5, 11, 15, 17, 21), theme, and rule toggles without leaving the main screen.

## 5. technical stack
- **frontend:** react 19, typescript
- **styling:** tailwind css v4 (`@tailwindcss/vite` plugin), css variables for theming
- **build tool:** vite 7
- **icons:** lucide-react
- **fonts:** google fonts (poppins, prompt)
- **audio:** web audio api (no asset files, synthesized in `src/utils/audio.ts`)


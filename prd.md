# scorbie - product requirements document (prd)

## 1. overview
**scorbie** is a simple, modern, and responsive web-based badminton scoreboard application. it allows users to track scores, manage serving sides, and enforce standard badminton rules like deuce and the skunk rule.

## 2. target audience
- casual badminton players who need a quick way to keep track of scores.
- referees or umpires in local tournaments.

## 3. core features
- **score tracking:** tap to increment or decrement scores for two teams.
- **serving logic:** visually indicates which side (left/right) should serve based on the current score (even score = right, odd score = left).
- **deuce rule:** when both teams reach `target score - 1` (e.g., 20-20), a team must win by 2 points.
- **skunk rule:** if a team reaches 3-0, the game ends immediately.
- **customizable settings:** users can change the target score and toggle rules (deuce, skunk, serving logic) on or off.
- **game reset:** quickly reset scores and serving state to start a new game.

## 4. user interface
- **mobile-first design:** optimized for touch devices with large, easy-to-tap score areas.
- **clear visual feedback:** distinct colors for each team, clear winner pop-up, and animated serving indicators.
- **settings modal:** an accessible modal to configure game rules without leaving the main screen.

## 5. technical stack
- **frontend:** react 19, typescript
- **styling:** tailwindcss
- **build tool:** vite
- **icons:** lucide-react

## 6. future enhancements
- match history and statistics tracking.
- custom team names and colors.
- multi-game (best of 3/5) support.
- sound effects toggle.

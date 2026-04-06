import { useState, useEffect } from 'react';
import { Settings, RotateCcw, Minus, ArrowLeftRight, PanelTop, ChevronDown } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import PlayerRow from './components/PlayerRow';
import { playScoreSound, playWinSound } from './utils/audio';
import { applyThemePalette, THEME_PRESETS } from './theme-presets';

const EMOJI_POOL = ['🐳', '🦄', '🐸', '🦊', '🐙', '🦁', '🐶', '🐼', '🐱', '🐔', '🌍', '🎄', '🍭', '🍦'];

// Custom Shuttlecock Icon
const ShuttlecockIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22a3 3 0 0 0 3-3c0-2.5-3-5-3-5s-3 2.5-3 5a3 3 0 0 0 3 3z" />
    <path d="M12 14L4.5 5.5a2 2 0 0 1 2.8-2.8L12 8" />
    <path d="M12 14l7.5-8.5a2 2 0 0 0-2.8-2.8L12 8" />
    <path d="M12 14V2" />
    <path d="M7 6l10 0" />
    <path d="M9 10l6 0" />
  </svg>
);

export type GameSettings = {
  targetScore: number;
  enableDeuce: boolean;
  enableServingLogic: boolean;
  enableDoublesMode: boolean;
  themeIndex: number;
  showTeamNames: boolean;
  /** โหมดคู่เปิดอยู่: แสดง/ซ่อนแถวอีโมจีผู้เล่น (กติกาโหมดคู่ยังทำงาน) */
  showDoublesPlayerRow: boolean;
};

type TeamPlayers = { left: string; right: string };
type EmojiPickerState = { team: 1 | 2; position: 'left' | 'right' } | null;

type TeamColor = 'blue' | 'pink';

const colorClasses: Record<TeamColor, { bg: string; bgDark: string; winnerBg: string; winnerText: string }> = {
  blue: {
    bg: 'bg-[var(--color-pastel-blue-light)]',
    bgDark: 'hover:bg-[var(--color-pastel-blue-hover)] active:bg-[var(--color-pastel-blue-hover)]',
    winnerBg: 'bg-[var(--color-pastel-blue-dark)]',
    winnerText: 'text-[var(--text-on-blue-dark)]',
  },
  pink: {
    bg: 'bg-[var(--color-pastel-pink-light)]',
    bgDark: 'hover:bg-[var(--color-pastel-pink-hover)] active:bg-[var(--color-pastel-pink-hover)]',
    winnerBg: 'bg-[var(--color-pastel-pink-dark)]',
    winnerText: 'text-[var(--text-on-pink-dark)]',
  },
};

function App() {
  const [team1, setTeam1] = useState({ name: 'Team A', score: 0, color: 'blue' as TeamColor });
  const [team2, setTeam2] = useState({ name: 'Team B', score: 0, color: 'pink' as TeamColor });
  
  const [settings, setSettings] = useState<GameSettings>({
    targetScore: 21,
    enableDeuce: true,
    enableServingLogic: true,
    enableDoublesMode: true,
    themeIndex: 0,
    showTeamNames: false,
    showDoublesPlayerRow: false,
  });

  const [showNavBar, setShowNavBar] = useState(false);

  useEffect(() => {
    const i = Math.min(Math.max(0, settings.themeIndex), THEME_PRESETS.length - 1);
    applyThemePalette(THEME_PRESETS[i]);
  }, [settings.themeIndex]);

  const [team1Players, setTeam1Players] = useState<TeamPlayers>({ left: '🐳', right: '🦄' });
  const [team2Players, setTeam2Players] = useState<TeamPlayers>({ left: '🐸', right: '🦊' });
  const [emojiPicker, setEmojiPicker] = useState<EmojiPickerState>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [servingTeam, setServingTeam] = useState<1 | 2>(1);

  const showDoublesRow = settings.enableDoublesMode && settings.showDoublesPlayerRow;

  // Check win condition whenever scores change
  useEffect(() => {
    if (winner) return;

    const s1 = team1.score;
    const s2 = team2.score;
    const target = settings.targetScore;

    let newWinner: number | null = null;

    if (settings.enableDeuce) {
        const isDeuceMode = s1 >= target - 1 && s2 >= target - 1;
        
        if (isDeuceMode) {
          // In deuce, need 2 points lead
          if (s1 >= target && s1 - s2 >= 2) newWinner = 1;
          else if (s2 >= target && s2 - s1 >= 2) newWinner = 2;
        } else {
          // Normal win
          if (s1 >= target) newWinner = 1;
          else if (s2 >= target) newWinner = 2;
        }
    } else {
      // No deuce, first to target wins
      if (s1 >= target) newWinner = 1;
      else if (s2 >= target) newWinner = 2;
    }

    if (newWinner) {
      setWinner(newWinner);
      playWinSound();
    }
  }, [team1.score, team2.score, settings, winner]);

  const handleScore = (teamIndex: 1 | 2, amount: number) => {
    if (winner) return;

    if (amount > 0) {
      if (settings.enableDoublesMode && settings.enableServingLogic && servingTeam === teamIndex) {
        if (teamIndex === 1) setTeam1Players(p => ({ left: p.right, right: p.left }));
        else setTeam2Players(p => ({ left: p.right, right: p.left }));
      }
      setServingTeam(teamIndex);
      playScoreSound();
    }

    if (teamIndex === 1) {
      setTeam1(prev => ({ ...prev, score: Math.max(0, prev.score + amount) }));
    } else {
      setTeam2(prev => ({ ...prev, score: Math.max(0, prev.score + amount) }));
    }
  };

  const handleSwap = () => {
    setTeam1(team2);
    setTeam2(team1);
    setTeam1Players(team2Players);
    setTeam2Players(team1Players);
    setServingTeam(prev => (prev === 1 ? 2 : 1));
  };

  const handleReset = () => {
    const shuffled = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
    setTeam1Players({ left: shuffled[0], right: shuffled[1] });
    setTeam2Players({ left: shuffled[2], right: shuffled[3] });
    setTeam1(prev => ({ ...prev, score: 0, color: 'blue' }));
    setTeam2(prev => ({ ...prev, score: 0, color: 'pink' }));
    setWinner(null);
    setServingTeam(1);
  };

  const getServingPosition = (teamIndex: 1 | 2): 'left' | 'right' | null => {
    if (!settings.enableDoublesMode || !settings.enableServingLogic) return null;
    if (servingTeam !== teamIndex) return null;
    const score = teamIndex === 1 ? team1.score : team2.score;
    return score % 2 === 0 ? 'right' : 'left';
  };

  const handleEmojiSelect = (emoji: string) => {
    if (!emojiPicker) return;
    const { team, position } = emojiPicker;
    if (team === 1) setTeam1Players(p => ({ ...p, [position]: emoji }));
    else setTeam2Players(p => ({ ...p, [position]: emoji }));
    setEmojiPicker(null);
  };

  const isDeuceMode =
    !winner &&
    settings.enableDeuce &&
    team1.score >= settings.targetScore - 1 &&
    team2.score >= settings.targetScore - 1;

  const renderServingIndicator = (teamIndex: 1 | 2, score: number) => {
    if (!settings.enableServingLogic) return null;
    if (servingTeam !== teamIndex) return null;

    const isEven = score % 2 === 0;
    const positionSide: 'left' | 'right' = isEven ? 'right' : 'left';
    const positionText = isEven ? 'ขวา (Right)' : 'ซ้าย (Left)';
    const positionClass = isEven ? 'right-4 landscape:right-8 md:right-8' : 'left-4 landscape:left-8 md:left-8';

    const players = teamIndex === 1 ? team1Players : team2Players;
    const serverEmoji = settings.enableDoublesMode ? players[positionSide] : null;

    return (
      <div className={`absolute top-6 landscape:top-4 landscape:md:top-6 ${positionClass} pointer-events-none z-20`}>
        <div className="bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-3 py-2 landscape:px-3 landscape:py-2 landscape:md:px-4 landscape:md:py-3 rounded-2xl flex flex-col items-center gap-1.5 shadow-md animate-bounce border-2 border-[var(--color-pastel-purple)] min-w-[4.5rem]">
          {serverEmoji !== null ? (
            <span
              className="text-5xl landscape:text-4xl landscape:md:text-6xl md:text-6xl leading-none [filter:drop-shadow(0_1px_2px_rgb(0_0_0/15%))]"
              aria-hidden
            >
              {serverEmoji}
            </span>
          ) : null}
          <span className="font-prompt leading-none text-base landscape:text-sm landscape:md:text-lg md:text-lg">
            เสิร์ฟ{positionText.split(' ')[0]}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[color-mix(in_srgb,var(--color-pastel-blue-light)_22%,white)] text-gray-800 overflow-hidden select-none font-sans">
      {/* Top Bar */}
      {showNavBar && (
        <div className="flex items-center justify-between p-4 landscape:p-2 landscape:md:p-4 bg-[var(--color-pastel-purple)] shadow-sm z-20 rounded-b-2xl mx-2 mt-2 landscape:mt-1 landscape:md:mt-2 relative">
          <div className="flex w-36 shrink-0 justify-start">
            <button
              type="button"
              onClick={() => setShowNavBar(false)}
              className="p-2 landscape:p-1.5 landscape:md:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
              title="ซ่อนแถบด้านบน"
            >
              <ChevronDown className="w-6 h-6 landscape:w-5 landscape:h-5 landscape:md:w-6 landscape:md:h-6" />
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <ShuttlecockIcon className="w-8 h-8 landscape:w-6 landscape:h-6 landscape:md:w-8 landscape:md:h-8 text-white drop-shadow-sm" />
              <h1 className="text-3xl landscape:text-xl landscape:md:text-3xl font-bold text-white hidden sm:block drop-shadow-sm font-poppins tracking-wide">Scorbie</h1>
            </div>
            {isDeuceMode && (
              <span className="bg-amber-400 text-white text-xs landscape:text-[10px] landscape:md:text-xs font-bold px-3 py-0.5 rounded-full tracking-widest uppercase animate-pulse shadow-md">
                Deuce
              </span>
            )}
          </div>

          <div className="flex gap-4 landscape:gap-2 landscape:md:gap-4">
            <button
              onClick={handleSwap}
              className="p-2 landscape:p-1.5 landscape:md:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
              title="Swap Teams"
            >
              <ArrowLeftRight className="w-6 h-6 landscape:w-5 landscape:h-5 landscape:md:w-6 landscape:md:h-6" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 landscape:p-1.5 landscape:md:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
              title="Reset Game"
            >
              <RotateCcw className="w-6 h-6 landscape:w-5 landscape:h-5 landscape:md:w-6 landscape:md:h-6" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 landscape:p-1.5 landscape:md:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
              title="Settings"
            >
              <Settings className="w-6 h-6 landscape:w-5 landscape:h-5 landscape:md:w-6 landscape:md:h-6" />
            </button>
          </div>
        </div>
      )}

      {!showNavBar && (
        <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/40 bg-[var(--color-pastel-purple)]/95 px-2 py-1.5 shadow-lg backdrop-blur-sm landscape:bottom-3">
          {isDeuceMode && (
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-amber-200">Deuce</span>
          )}
          <button
            type="button"
            onClick={() => setShowNavBar(true)}
            className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 active:scale-95"
            title="แสดงแถบด้านบน"
          >
            <PanelTop className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleSwap}
            className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 active:scale-95"
            title="Swap Teams"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 active:scale-95"
            title="Reset Game"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 active:scale-95"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main Score Area */}
      <div className="flex-1 flex flex-col landscape:flex-row md:flex-row relative p-2 landscape:p-2 landscape:md:p-4 gap-2 landscape:gap-2 landscape:md:gap-4">
        {/* Team 1 */}
        <div className={`flex-1 flex flex-col relative rounded-3xl overflow-hidden shadow-sm border-2 border-white/50 transition-colors duration-500 ${isDeuceMode ? 'bg-amber-100' : colorClasses[team1.color].bg}`}>
          {(settings.showTeamNames || showDoublesRow) && (
            <div className={`text-center z-10 bg-white/30 backdrop-blur-sm border-b border-white/40 ${settings.showTeamNames ? 'p-4 landscape:p-2 landscape:md:p-4' : 'py-2 landscape:py-1'}`}>
              {settings.showTeamNames && (
                <input
                  type="text"
                  value={team1.name}
                  onChange={(e) => setTeam1({ ...team1, name: e.target.value })}
                  className="bg-transparent text-3xl landscape:text-xl landscape:md:text-5xl md:text-5xl font-bold text-center w-full outline-none focus:border-b-2 border-white/50 transition-colors font-prompt text-gray-800"
                />
              )}
              {showDoublesRow && (
                <PlayerRow
                  players={team1Players}
                  servingPosition={getServingPosition(1)}
                  onSwap={() => setTeam1Players(p => ({ left: p.right, right: p.left }))}
                  onEmojiTap={(pos) => setEmojiPicker({ team: 1, position: pos })}
                />
              )}
            </div>
          )}
          
          <button 
            onClick={() => handleScore(1, 1)}
            disabled={winner !== null}
            className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer relative
              ${isDeuceMode ? 'hover:bg-amber-200 active:bg-amber-300' : colorClasses[team1.color].bgDark}
              ${winner !== null && winner !== 1 ? 'opacity-50 grayscale' : ''}
            `}
          >
            {renderServingIndicator(1, team1.score)}
            <span className="text-[25vh] landscape:text-[35vh] landscape:md:text-[40vh] md:text-[40vh] font-bold leading-none tabular-nums tracking-tighter text-gray-800 drop-shadow-sm">
              {team1.score}
            </span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleScore(1, -1); }}
            disabled={winner !== null || team1.score === 0}
            className="absolute bottom-4 left-4 landscape:bottom-3 landscape:left-3 landscape:md:bottom-4 landscape:md:left-4 p-2 landscape:p-1.5 landscape:md:p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-sm z-20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-transform"
          >
            <Minus className="w-5 h-5 landscape:w-4 landscape:h-4 landscape:md:w-5 landscape:md:h-5 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Team 2 */}
        <div className={`flex-1 flex flex-col relative rounded-3xl overflow-hidden shadow-sm border-2 border-white/50 transition-colors duration-500 ${isDeuceMode ? 'bg-amber-100' : colorClasses[team2.color].bg}`}>
          {(settings.showTeamNames || showDoublesRow) && (
            <div className={`text-center z-10 bg-white/30 backdrop-blur-sm border-b border-white/40 ${settings.showTeamNames ? 'p-4 landscape:p-2 landscape:md:p-4' : 'py-2 landscape:py-1'}`}>
              {settings.showTeamNames && (
                <input
                  type="text"
                  value={team2.name}
                  onChange={(e) => setTeam2({ ...team2, name: e.target.value })}
                  className="bg-transparent text-3xl landscape:text-xl landscape:md:text-5xl md:text-5xl font-bold text-center w-full outline-none focus:border-b-2 border-white/50 transition-colors font-prompt text-gray-800"
                />
              )}
              {showDoublesRow && (
                <PlayerRow
                  players={team2Players}
                  servingPosition={getServingPosition(2)}
                  onSwap={() => setTeam2Players(p => ({ left: p.right, right: p.left }))}
                  onEmojiTap={(pos) => setEmojiPicker({ team: 2, position: pos })}
                />
              )}
            </div>
          )}
          
          <button 
            onClick={() => handleScore(2, 1)}
            disabled={winner !== null}
            className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer relative
              ${isDeuceMode ? 'hover:bg-amber-200 active:bg-amber-300' : colorClasses[team2.color].bgDark}
              ${winner !== null && winner !== 2 ? 'opacity-50 grayscale' : ''}
            `}
          >
            {renderServingIndicator(2, team2.score)}
            <span className="text-[25vh] landscape:text-[35vh] landscape:md:text-[40vh] md:text-[40vh] font-bold leading-none tabular-nums tracking-tighter text-gray-800 drop-shadow-sm">
              {team2.score}
            </span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleScore(2, -1); }}
            disabled={winner !== null || team2.score === 0}
            className="absolute bottom-4 right-4 landscape:bottom-3 landscape:right-3 landscape:md:bottom-4 landscape:md:right-4 p-2 landscape:p-1.5 landscape:md:p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-sm z-20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-transform"
          >
            <Minus className="w-5 h-5 landscape:w-4 landscape:h-4 landscape:md:w-5 landscape:md:h-5 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Winner Pop-up */}
      {winner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm p-3 landscape:p-2">
          <div 
            className={`rounded-3xl shadow-2xl text-center max-w-lg w-full max-h-[min(90dvh,90svh)] landscape:max-h-[min(82dvh,82svh)] overflow-hidden flex flex-col items-center justify-center gap-4 landscape:gap-1.5 p-8 landscape:p-2.5 md:p-12 transform animate-bounce-in border-4 landscape:border-2 border-white
              ${colorClasses[winner === 1 ? team1.color : team2.color].winnerBg}
            `}
            style={{ animation: 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
            <ShuttlecockIcon className="shrink-0 w-20 h-20 landscape:w-[min(2.75rem,11vmin)] landscape:h-[min(2.75rem,11vmin)] md:w-24 md:h-24 mx-auto text-white drop-shadow-md" />
            <h2 className={`w-full min-h-0 font-bold font-prompt px-1 text-4xl md:text-5xl landscape:text-[clamp(0.75rem,3.8vmin,1.5rem)] landscape:leading-tight landscape:line-clamp-2 landscape:break-words ${colorClasses[winner === 1 ? team1.color : team2.color].winnerText}`}>
              {winner === 1 ? team1.name : team2.name}
            </h2>
            <p className="shrink-0 text-2xl md:text-3xl font-bold text-white drop-shadow-sm landscape:text-[clamp(0.65rem,3vmin,1rem)] landscape:leading-tight">
              WINS THE GAME!
            </p>
            <button 
              onClick={handleReset}
              className="shrink-0 bg-white text-gray-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-md w-full text-xl px-8 py-4 landscape:text-[clamp(0.65rem,2.8vmin,0.95rem)] landscape:py-1.5 landscape:px-5 md:py-4"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          setSettings={setSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      {emojiPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setEmojiPicker(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-bold text-gray-600 mb-4 font-prompt text-center">เลือกผู้เล่น</p>
            <div className="grid grid-cols-5 gap-2">
              {(() => {
                const currentTeamPlayers = emojiPicker.team === 1 ? team1Players : team2Players;
                const currentEmoji = currentTeamPlayers[emojiPicker.position];
                const allUsed = [team1Players.left, team1Players.right, team2Players.left, team2Players.right];
                return EMOJI_POOL.filter(e => e === currentEmoji || !allUsed.includes(e)).map(e => (
                  <button
                    key={e}
                    onClick={() => handleEmojiSelect(e)}
                    className={`text-3xl p-2 rounded-2xl transition-all active:scale-90
                      ${e === currentEmoji
                        ? 'bg-[var(--color-pastel-purple)]/20 ring-2 ring-[var(--color-pastel-purple)]'
                        : 'hover:bg-gray-100'
                      }
                    `}
                  >
                    {e}
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Add keyframes for the popup animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default App;
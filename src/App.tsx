import { useState, useEffect } from 'react';
import { Settings, RotateCcw, Minus, CircleDot, ArrowLeftRight } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import { playScoreSound, playWinSound } from './utils/audio';

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
  enableSkunkRule: boolean;
  enableDeuce: boolean;
  enableServingLogic: boolean;
};

type TeamColor = 'blue' | 'pink';

const colorClasses: Record<TeamColor, { bg: string; bgDark: string; winnerBg: string }> = {
  blue: {
    bg: 'bg-[var(--color-pastel-blue-light)]',
    bgDark: 'hover:bg-[var(--color-pastel-blue-dark)] active:bg-[var(--color-pastel-blue-dark)]',
    winnerBg: 'bg-[var(--color-pastel-blue-dark)]',
  },
  pink: {
    bg: 'bg-[var(--color-pastel-pink-light)]',
    bgDark: 'hover:bg-[var(--color-pastel-pink-dark)] active:bg-[var(--color-pastel-pink-dark)]',
    winnerBg: 'bg-[var(--color-pastel-pink-dark)]',
  },
};

function App() {
  const [team1, setTeam1] = useState({ name: 'Team A', score: 0, color: 'blue' as TeamColor });
  const [team2, setTeam2] = useState({ name: 'Team B', score: 0, color: 'pink' as TeamColor });
  
  const [settings, setSettings] = useState<GameSettings>({
    targetScore: 21,
    enableSkunkRule: false,
    enableDeuce: true,
    enableServingLogic: true,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [servingTeam, setServingTeam] = useState<1 | 2>(1);

  // Check win condition whenever scores change
  useEffect(() => {
    if (winner) return;

    const s1 = team1.score;
    const s2 = team2.score;
    const target = settings.targetScore;

    let newWinner: number | null = null;

    // Skunk rule (3-0 instant win)
    if (settings.enableSkunkRule) {
      if (s1 === 3 && s2 === 0) newWinner = 1;
      else if (s2 === 3 && s1 === 0) newWinner = 2;
    }

    // Normal win & Deuce logic
    if (!newWinner) {
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
    }

    if (newWinner) {
      setWinner(newWinner);
      playWinSound();
    }
  }, [team1.score, team2.score, settings, winner]);

  const handleScore = (teamIndex: 1 | 2, amount: number) => {
    if (winner) return;
    
    if (amount > 0) {
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
    setServingTeam(prev => (prev === 1 ? 2 : 1));
  };

  const handleReset = () => {
    setTeam1(prev => ({ ...prev, score: 0, color: 'blue' }));
    setTeam2(prev => ({ ...prev, score: 0, color: 'pink' }));
    setWinner(null);
    setServingTeam(1);
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
    const positionText = isEven ? 'ขวา (Right)' : 'ซ้าย (Left)';
    const positionClass = isEven ? 'right-4 landscape:right-8 md:right-8' : 'left-4 landscape:left-8 md:left-8';

    return (
      <div className={`absolute top-6 landscape:top-4 landscape:md:top-6 ${positionClass} pointer-events-none z-20`}>
        <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm landscape:text-sm landscape:md:text-base md:text-base font-bold px-4 py-2 landscape:px-3 landscape:py-1 landscape:md:px-4 landscape:md:py-2 rounded-2xl flex flex-col items-center gap-1 shadow-md animate-bounce border-2 border-[var(--color-pastel-purple)]">
          <CircleDot className="w-5 h-5 landscape:w-4 landscape:h-4 landscape:md:w-5 landscape:md:h-5 text-[var(--color-pastel-purple)]" />
          <span className="font-prompt leading-none">เสิร์ฟ{positionText.split(' ')[0]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#f8f9fa] text-gray-800 overflow-hidden select-none font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 landscape:p-2 landscape:md:p-4 bg-[var(--color-pastel-purple)] shadow-sm z-20 rounded-b-2xl mx-2 mt-2 landscape:mt-1 landscape:md:mt-2 relative">
        {/* Empty div for flex spacing */}
        <div className="w-36"></div>
        
        {/* Center Logo & Title */}
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

      {/* Main Score Area */}
      <div className="flex-1 flex flex-col landscape:flex-row md:flex-row relative p-2 landscape:p-2 landscape:md:p-4 gap-2 landscape:gap-2 landscape:md:gap-4">
        {/* Team 1 */}
        <div className={`flex-1 flex flex-col relative rounded-3xl overflow-hidden shadow-sm border-2 border-white/50 transition-colors duration-500 ${isDeuceMode ? 'bg-amber-100' : colorClasses[team1.color].bg}`}>
          <div className="p-4 landscape:p-2 landscape:md:p-4 text-center z-10 bg-white/30 backdrop-blur-sm border-b border-white/40">
            <input 
              type="text" 
              value={team1.name}
              onChange={(e) => setTeam1({ ...team1, name: e.target.value })}
              className="bg-transparent text-3xl landscape:text-3xl landscape:md:text-5xl md:text-5xl font-bold text-center w-full outline-none focus:border-b-2 border-white/50 transition-colors font-prompt text-gray-800"
            />
          </div>
          
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
            className="absolute bottom-6 left-6 landscape:bottom-4 landscape:left-4 landscape:md:bottom-6 landscape:md:left-6 p-4 landscape:p-3 landscape:md:p-6 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-sm z-20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-transform"
          >
            <Minus className="w-8 h-8 landscape:w-8 landscape:h-8 landscape:md:w-10 landscape:md:h-10 md:w-10 md:h-10" />
          </button>
        </div>

        {/* Team 2 */}
        <div className={`flex-1 flex flex-col relative rounded-3xl overflow-hidden shadow-sm border-2 border-white/50 transition-colors duration-500 ${isDeuceMode ? 'bg-amber-100' : colorClasses[team2.color].bg}`}>
          <div className="p-4 landscape:p-2 landscape:md:p-4 text-center z-10 bg-white/30 backdrop-blur-sm border-b border-white/40">
            <input 
              type="text" 
              value={team2.name}
              onChange={(e) => setTeam2({ ...team2, name: e.target.value })}
              className="bg-transparent text-3xl landscape:text-3xl landscape:md:text-5xl md:text-5xl font-bold text-center w-full outline-none focus:border-b-2 border-white/50 transition-colors font-prompt text-gray-800"
            />
          </div>
          
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
            className="absolute bottom-6 right-6 landscape:bottom-4 landscape:right-4 landscape:md:bottom-6 landscape:md:right-6 p-4 landscape:p-3 landscape:md:p-6 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-sm z-20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-transform"
          >
            <Minus className="w-8 h-8 landscape:w-8 landscape:h-8 landscape:md:w-10 landscape:md:h-10 md:w-10 md:h-10" />
          </button>
        </div>
      </div>

      {/* Winner Pop-up */}
      {winner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div 
            className={`rounded-3xl shadow-2xl p-8 landscape:p-6 landscape:md:p-12 md:p-12 text-center max-w-lg w-full transform animate-bounce-in border-4 border-white
              ${colorClasses[winner === 1 ? team1.color : team2.color].winnerBg}
            `}
            style={{ animation: 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
            <ShuttlecockIcon className="w-20 h-20 landscape:w-16 landscape:h-16 landscape:md:w-24 landscape:md:h-24 md:w-24 md:h-24 mx-auto text-white drop-shadow-md mb-6 landscape:mb-4 landscape:md:mb-6" />
            <h2 className="text-4xl landscape:text-3xl landscape:md:text-5xl md:text-5xl font-bold text-gray-900 mb-2 font-prompt">
              {winner === 1 ? team1.name : team2.name}
            </h2>
            <p className="text-2xl landscape:text-xl landscape:md:text-3xl md:text-3xl font-bold text-white drop-shadow-sm mb-8 landscape:mb-4 landscape:md:mb-8">
              WINS THE GAME!
            </p>
            <button 
              onClick={handleReset}
              className="bg-white text-gray-900 font-bold text-xl landscape:text-lg landscape:md:text-xl px-8 py-4 landscape:py-2 landscape:md:py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-md w-full"
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
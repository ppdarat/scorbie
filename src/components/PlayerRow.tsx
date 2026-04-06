import { ArrowLeftRight } from 'lucide-react';

type Props = {
  players: { left: string; right: string };
  servingPosition: 'left' | 'right' | null;
  onSwap: () => void;
  onEmojiTap: (position: 'left' | 'right') => void;
};

export default function PlayerRow({ players, servingPosition, onSwap, onEmojiTap }: Props) {
  const renderEmoji = (position: 'left' | 'right') => {
    const isServing = servingPosition === position;
    return (
      <button
        onClick={() => onEmojiTap(position)}
        className={`text-5xl landscape:text-3xl landscape:md:text-5xl leading-none transition-all duration-200 rounded-full w-[4.25rem] h-[4.25rem] landscape:w-[3rem] landscape:h-[3rem] landscape:md:w-[3.75rem] landscape:md:h-[3.75rem] flex items-center justify-center active:scale-90
          ${isServing
            ? 'scale-110 landscape:scale-105 ring-[3px] ring-[var(--color-pastel-purple)] ring-offset-[3px] bg-white/80 shadow-md'
            : 'opacity-60 hover:opacity-95'
          }
        `}
      >
        {players[position]}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center gap-2 landscape:gap-1 py-1.5 landscape:py-0">
      {renderEmoji('left')}
      <button
        onClick={onSwap}
        className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 text-gray-500 hover:text-gray-700 transition-all active:scale-90"
        title="สลับตำแหน่ง"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
      </button>
      {renderEmoji('right')}
    </div>
  );
}

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
        className={`text-3xl landscape:text-xl leading-none transition-all duration-200 rounded-full w-12 h-12 landscape:w-8 landscape:h-8 flex items-center justify-center active:scale-90
          ${isServing
            ? 'scale-125 landscape:scale-110 ring-2 ring-[var(--color-pastel-purple)] ring-offset-2 bg-white/80 shadow-md'
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

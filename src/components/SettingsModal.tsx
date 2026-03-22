import React from 'react';
import { X } from 'lucide-react';
import type { GameSettings } from '../App';

type Props = {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onClose: () => void;
};

const SettingsModal: React.FC<Props> = ({ settings, setSettings, onClose }) => {
  const targetScores = [5, 11, 15, 17, 21];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border-2 border-white flex flex-col max-h-[90vh] my-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[var(--color-pastel-purple)]">
          <h2 className="text-xl font-bold text-white drop-shadow-sm font-prompt">ตั้งค่าเกม (Settings)</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Target Score */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 font-prompt">
              คะแนนเป้าหมาย (Target Score)
            </label>
            <div className="flex flex-wrap gap-2">
              {targetScores.map(score => (
                <button
                  key={score}
                  onClick={() => setSettings({ ...settings, targetScore: score })}
                  className={`px-4 py-2 rounded-xl font-bold transition-all font-sans ${
                    settings.targetScore === score 
                      ? 'bg-[var(--color-pastel-purple)] text-white shadow-md scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Toggles */}
          <div className="space-y-5">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <div className="font-bold text-gray-800 group-hover:text-[var(--color-pastel-purple)] transition-colors font-prompt">ระบบดิวซ์ (Deuce)</div>
                <div className="text-sm text-gray-500 font-prompt">ต้องชนะห่าง 2 แต้มเมื่อคะแนนเสมอที่แต้มก่อนชนะ</div>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.enableDeuce}
                  onChange={(e) => setSettings({ ...settings, enableDeuce: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors shadow-inner ${settings.enableDeuce ? 'bg-[var(--color-pastel-purple)]' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${settings.enableDeuce ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <div className="font-bold text-gray-800 group-hover:text-[var(--color-pastel-purple)] transition-colors font-prompt">กฎ 3-0 ชนะทันที (Skunk Rule)</div>
                <div className="text-sm text-gray-500 font-prompt">ถ้าคะแนนห่าง 3-0 ให้ถือว่าชนะเกมทันที</div>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.enableSkunkRule}
                  onChange={(e) => setSettings({ ...settings, enableSkunkRule: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors shadow-inner ${settings.enableSkunkRule ? 'bg-[var(--color-pastel-purple)]' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${settings.enableSkunkRule ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <div className="font-bold text-gray-800 group-hover:text-[var(--color-pastel-purple)] transition-colors font-prompt">แสดงฝั่งเสิร์ฟ (Serving Side)</div>
                <div className="text-sm text-gray-500 font-prompt">แต้มคู่เสิร์ฟขวา แต้มคี่เสิร์ฟซ้าย</div>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.enableServingLogic}
                  onChange={(e) => setSettings({ ...settings, enableServingLogic: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors shadow-inner ${settings.enableServingLogic ? 'bg-[var(--color-pastel-purple)]' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${settings.enableServingLogic ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-[var(--color-pastel-purple)] hover:opacity-90 text-white rounded-xl font-bold text-lg transition-all shadow-md active:scale-95 font-prompt"
          >
            บันทึกและปิด (Save & Close)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
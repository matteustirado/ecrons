import { COLOR_PALETTE } from '../../../../constants/KeyboardEmojis';

export default function ColorPicker({ onSelect, onClose }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-52 origin-top-right animate-fade-in rounded-2xl border border-white/20 bg-[#1a1a1a] p-4 shadow-2xl">
      <div className="grid grid-cols-5 gap-3">
        {COLOR_PALETTE.map((colorHex, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelect(colorHex);
              onClose();
            }}
            className="group relative h-7 w-7 rounded-full border border-white/10 shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: colorHex }}
            title={`Cor ${idx + 1}`}
          />
        ))}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3 text-center">
        <button
          onClick={onClose}
          className="text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
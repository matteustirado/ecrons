import { getMovementMessage } from '../../../constants/movementMessages';

export default function Thermometer({ crowdPercentage, isLandscape }) {
  const parsedPercentage = Number(crowdPercentage);

  const validPct = Number.isFinite(parsedPercentage)
    ? Math.max(0, Math.min(100, Math.round(parsedPercentage)))
    : 0;

  const currentPhrase = getMovementMessage(validPct);

  return (
    <div
      className={`pt-4 flex w-full shrink-0 flex-col items-center border-t border-white/10 ${
        isLandscape ? 'mt-6' : 'mt-10'
      }`}
    >
      <div
        className={`mb-2 relative w-full max-w-5xl overflow-hidden rounded-full border border-white/10 bg-black/60 shadow-inner ${
          isLandscape ? 'h-6' : 'h-12'
        }`}
      >
        <div
          className="relative h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${validPct}%`,
            background: 'linear-gradient(90deg, #FFCC00 0%, #FF4D00 50%, #FF0000 100%)',
            boxShadow: '0 0 30px rgba(255, 77, 0, 0.8)',
          }}
        >
          <div className="absolute inset-0 animate-pulse bg-white/20" />
        </div>
      </div>
      <p
        className={`animate-fade-in text-center font-light uppercase tabular-nums tracking-[0.2em] text-white drop-shadow-md ${
          isLandscape ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'
        }`}
      >
        {currentPhrase}
      </p>
    </div>
  );
}
export default function PriceCard({ index, qtdPessoas, colData, liveState, defaults, mediaData, isActive }) {
  const defCombo = defaults.find(
    (item) =>
      item.tipoDia === colData.tipoDia &&
      item.periodo === colData.key &&
      Number(item.qtdPessoas) === qtdPessoas
  );

  let finalPrice = 0;
  let showQuestionMarks = false;

  if (colData.type === 'current') {
    if (qtdPessoas === 1) {
      finalPrice = parseFloat(liveState.valorAtual);
    } else {
      if (liveState.isPadrao) {
        finalPrice = defCombo ? parseFloat(defCombo.valor) : 0;
      } else {
        showQuestionMarks = true;
      }
    }
  } else if (colData.type === 'future') {
    if (liveState.isPadrao) {
      finalPrice = defCombo ? parseFloat(defCombo.valor) : 0;
    } else {
      if (liveState.textoFuturo === '???' && !liveState.valorFuturo) {
        showQuestionMarks = true;
      } else if (liveState.valorFuturo && qtdPessoas === 1) {
        finalPrice = parseFloat(liveState.valorFuturo);
      } else {
        showQuestionMarks = true;
      }
    }
  } else if (colData.type === 'past') {
    if (liveState.valorPassado && qtdPessoas === 1) {
      finalPrice = parseFloat(liveState.valorPassado);
    } else {
      finalPrice = defCombo ? parseFloat(defCombo.valor) : 0;
    }
  }

  const formatPrice = (value) =>
    value
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      .replace('R$', '')
      .trim();

  let mainDisplayPrice = showQuestionMarks ? '???' : `R$ ${formatPrice(finalPrice)}`;
  let subText = null;
  let topText = null;

  if (qtdPessoas === 2) {
    mainDisplayPrice = showQuestionMarks ? '???' : `R$ ${formatPrice(finalPrice / 2)}`;
    topText = 'cada um paga';
    subText = showQuestionMarks ? '' : `valor total da dupla R$ ${formatPrice(finalPrice)}`;
  } else if (qtdPessoas === 3) {
    mainDisplayPrice = showQuestionMarks ? '???' : `R$ ${formatPrice(finalPrice / 3)}`;
    topText = 'cada um paga';
    subText = showQuestionMarks ? '' : `valor total do trio R$ ${formatPrice(finalPrice)}`;
  }

  const title = mediaData?.titulo || (qtdPessoas === 1 ? 'Individual' : qtdPessoas === 2 ? 'Mão Amiga' : 'Marmita');
  
  const rawMediaUrl = mediaData?.mediaUrl;
  const mediaUrl = rawMediaUrl 
    ? (rawMediaUrl.startsWith('http') ? rawMediaUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${rawMediaUrl}`) 
    : null;

  const isVideo = mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm'));

  if (!isActive) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-4 shadow-xl backdrop-blur-2xl md:h-36 lg:h-40 lg:p-5">
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-orange-500/10" />
        <div className="relative z-10 flex h-full flex-col justify-center">
          <h3 className="mb-2 text-base font-black uppercase leading-tight tracking-wide text-white lg:mb-3 lg:text-lg">
            {title}
          </h3>
          {qtdPessoas === 1 ? (
            <div className="text-3xl font-black leading-none tracking-[-0.06em] text-white lg:text-4xl">
              {mainDisplayPrice}
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-1">
              <span className="text-[0.7rem] font-black uppercase tracking-widest text-white/55">cada um paga</span>
              <div className="text-2xl font-black leading-none tracking-[-0.06em] text-white lg:text-3xl">
                {mainDisplayPrice}
              </div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-wide text-white/45">{subText}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const activeBackground = index === 0 ? 'from-orange-500/35' : index === 1 ? 'from-yellow-500/30' : 'from-purple-500/30';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-400/40 bg-black/55 p-6 shadow-[0_0_35px_rgba(249,115,22,0.22),0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:h-52 lg:h-64 lg:p-7">
      <div className={`absolute inset-0 bg-linear-to-br ${activeBackground} via-black/55 to-black/80`} />
      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />
      {mediaUrl && (isVideo ? (
        <video src={mediaUrl} className="absolute inset-0 h-full w-full object-cover opacity-35" autoPlay loop muted playsInline />
      ) : (
        <img src={mediaUrl} className="absolute inset-0 h-full w-full object-cover opacity-35" alt="" />
      ))}
      <div className={`relative z-10 flex min-h-full flex-col justify-center ${index === 1 ? 'items-end text-right' : 'items-start text-left'}`}>
        <h3 className="mb-3 text-xl font-black uppercase leading-tight tracking-wide text-white drop-shadow-lg lg:mb-4 xl:text-2xl">
          {title}
        </h3>
        {qtdPessoas === 1 ? (
          <div className="text-4xl font-black leading-none tracking-[-0.06em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] xl:text-5xl">
            {mainDisplayPrice}
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-2">
            <span className="text-sm font-black uppercase tracking-widest text-white/65 xl:text-base">
              {topText}
            </span>
            <div className="text-4xl font-black leading-none tracking-[-0.06em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] xl:text-5xl">
              {mainDisplayPrice}
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wide text-white/55 xl:text-sm">
              {subText}
            </span>
          </div>
        )}
        {mediaData?.avisoCategoria && (
          <div className="mt-4 max-w-full truncate rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-normal text-white/75">
            {mediaData.avisoCategoria}
          </div>
        )}
      </div>
    </div>
  );
}
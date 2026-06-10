import React, { useState } from 'react';

interface BlindModeProps {
  onRegisterAnalysis: (comparisonText: string, resultLabel: string) => void;
}

export function BlindMode({ onRegisterAnalysis }: BlindModeProps) {
  // Hardcoded blind mode high-resolution forensic images from specification
  const imgBlindA = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiXOL1dcFLbbkmwk0HpE5_BcPkKGT2Xc2YTdfNrU11vZMXJu_z_z4Mg7uTW_0T15_HMa1s6UgK0JRzHZGOOPlKxhQSmGaAx-ZiyllzvRetzh-woDSZ6A8JvHd6KkgCgMgJV6M6YKiwvsGwd_rl1LpVEOmZNTXGvQfyNLcB6AiJAv4MD6VEAlUeutE_sBkCRc_cDUzDNrXVIf70CC9DVHaYTy0f2Y0FjFL1XJqIC1yikhL4NuBZDXmB4NLL-36Me0XqnH8hXcl-LY8';
  const imgBlindB = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJCWHSbLFPMFc9Z9ch6ONuykwAsrU2rSFBa4X4CRNKWkWrnl_SyhPSdpp3-rpUpTpqeC0AovKEviLiDbhESDVToBbLt1uzWz-BD5noCqYE4gPBlO0C9nF9nMX-Mu84m_4aanH4Z1qmY4xahkL96PSW_Rn1mhKUfneHShQFgyr-o_t_JRB9Mf9a3YldprLJdM5htEo906vaQjxMmQX3fq-zWCO391LGF4c1h4NTaKG3LmEIDdQ-zwGzTUgl959qap2Huj9SGtk10GQ';

  const [observations, setObservations] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState(false);

  const handleReveal = () => {
    if (!observations.trim()) {
      setErrorFeedback(true);
      setTimeout(() => setErrorFeedback(false), 2500);
      return;
    }
    setRevealed(true);
    onRegisterAnalysis(
      observations,
      "Lado A: Inteligência Artificial (Modelo CAD) / Lado B: Humano (Fotografia de Fábrica)"
    );
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Status Header */}
      <div className="bg-primary text-on-primary p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 select-none">
        <span className="font-sans font-extrabold text-xs tracking-widest uppercase">
          [ STATUS: MODO CEGO ATIVADO ]
        </span>
        <span className="font-mono text-xs font-bold uppercase text-[11px] tracking-wider opacity-90">
          IDENTIDADE E ORIGEM OCULTADAS ATÉ O REGISTRO
        </span>
      </div>

      {/* Comparison grid - hiding origin context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-outline bg-surface-container-lowest">
        
        {/* Aspect Panel A */}
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-outline bg-surface-container-lowest relative">
          <div className="p-3 border-b border-primary bg-surface-container-high flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-primary">[ ASPECTO ] LADO A</span>
            <span className="font-mono text-[10px] text-outline">REF_ID: 0X9A2C</span>
          </div>

          <div className="min-h-[350px] h-[350px] relative overflow-hidden flex items-center justify-center p-4">
            <img
              src={imgBlindA}
              alt="Monochrome schematic comparison arm"
              className="max-w-full max-h-full object-contain filter grayscale contrast-125 select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {revealed && (
            <div className="p-3 bg-secondary text-white text-center font-mono text-[11px] font-bold uppercase select-none border-t border-primary tracking-wider animate-fadeIn">
              ORIGEM REVELADA: IA (MODELO CAD GEOMÉTRICO)
            </div>
          )}
        </div>

        {/* Aspect Panel B */}
        <div className="flex flex-col bg-surface-container-lowest relative">
          <div className="p-3 border-b border-primary bg-surface-container-high flex justify-between items-center">
            <span className="font-mono font-bold text-xs text-primary">[ ASPECTO ] LADO B</span>
            <span className="font-mono text-[10px] text-outline">REF_ID: 0X7F3E</span>
          </div>

          <div className="min-h-[350px] h-[350px] relative overflow-hidden flex items-center justify-center p-4">
            <img
              src={imgBlindB}
              alt="Gritty machine factory arm comparative aspect"
              className="max-w-full max-h-full object-contain filter grayscale contrast-110 select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {revealed && (
            <div className="p-3 bg-secondary text-white text-center font-mono text-[11px] font-bold uppercase select-none border-t border-primary tracking-wider animate-fadeIn">
              ORIGEM REVELADA: HUMANO (FOTOGRAFIA REAL DE AUDITORIA)
            </div>
          )}
        </div>

      </div>

      {/* Structured analytical reporting box */}
      <div className="bg-surface p-6 border border-primary space-y-4">
        <div>
          <label className="block font-sans font-bold text-xs text-primary uppercase tracking-wider mb-2">
            DESCREVA DISCREPÂNCIA OBSERVADA (OBRIGATÓRIO):
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            disabled={revealed}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full bg-surface-container-lowest border border-outline-variant p-4 font-mono text-xs text-primary focus:outline-none focus:border-secondary transition-all h-[100px] resize-none"
            placeholder="DIGITE AS OBSERVAÇÕES TÉCNICAS REVELADORAS AQUI PARA DESBLOQUEAR A IDENTIDADE..."
          />
        </div>

        {errorFeedback && (
          <div className="p-3 bg-surface border border-secondary text-secondary text-xs font-mono">
            [ BLOQUEIO DE COMPACTAÇÃO ]: O preenchimento da análise textual é mandatório antes de romper o lacre cego.
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
          <div className="text-[11px] font-mono text-on-surface-variant font-semibold">
            {revealed ? (
              <span className="text-secondary animate-pulse uppercase">
                [ RESULTADO: LADO A: MODELO DE IA / LADO B: MODELO HUMANO ]
              </span>
            ) : (
              <span className="text-outline">
                O registro gerará um carimbo de auditoria permanente no diário local.
              </span>
            )}
          </div>

          <button
            onClick={handleReveal}
            disabled={revealed}
            id="reveal-origins-btn"
            className={`w-full sm:w-auto px-10 py-3 font-sans text-xs font-bold tracking-widest border transition-all uppercase ${
              revealed
                ? 'bg-surface-container text-outline border-outline-variant cursor-not-allowed'
                : 'bg-primary text-on-primary border-primary hover:bg-secondary hover:border-secondary cursor-pointer'
            }`}
          >
            {revealed ? 'LACRE ROMPIDO/REVELADO' : 'REVELAR ORIGENS'}
          </button>
        </div>
      </div>
    </div>
  );
}

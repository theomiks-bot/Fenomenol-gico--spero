import React, { useState, useRef, useEffect } from 'react';
import { Gap } from '../types';

interface EvidentialConfrontationProps {
  gaps: Gap[];
  onAddGap: (gap: Gap) => void;
  onClearGaps: () => void;
}

export function EvidentialConfrontation({ gaps, onAddGap, onClearGaps }: EvidentialConfrontationProps) {
  // Default forensic assets (from the specification mockups)
  const defaultCad = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYBbW8oJEjwoOdr6ku75UGBqH2nL0_u49Len3xKtwlm50Tkg2sfINJME1U4s6qCwhaj4Kg-nTw_uJt6RIdoQN6aIOJIO2mx0-htSKPxgb2Hlglqph-n0MdSh7oRZPHyDdrdd08EV8Sk05WkcGmbsI_AFpxH-ixRVYKTXgcXsbPiZnq4B6PNdgLsPuiWYF5KnFgNfKVy0MsCSyxAOdZJlHQ2DslFs8Rby0SJdipvBYQue2Ev-7WLO3wcRVshzv4z8WjuYCBdnJtbfo';
  const defaultPhysical = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsVPtTYyirSA368FvP4yEourkp_Q3oZX_KoIkT2grQ2QMkokJ9Rd0ZjO1rK1bjC6hrzUjY4fmLhDcKItmmhsGSYZ9k9FdKJ8heZhzKh3wab5qZNO8ermALrUJ5gvLoPoaTGx2CXJg4qY7tNlnFqmmP6jNiKQDQjwRJekqZZ-Du7ysaECyWD8Rxs-0rJ99wsP35rtR6Dz9ju04riQbT7Kw_D6V4JwUNUxs1t9WFUUnF8fWeWQxzRfkvcQN2g8_fUgiDAZWSi4brxE';

  const [cadImage, setCadImage] = useState(defaultCad);
  const [physicalImage, setPhysicalImage] = useState(defaultPhysical);
  const [overlayOpacity, setOverlayOpacity] = useState(50); // 0 to 100
  const [isMarkingMode, setIsMarkingMode] = useState(false);
  const [lastMarkedMessage, setLastMarkedMessage] = useState<string | null>(null);

  // File upload refs
  const cadInputRef = useRef<HTMLInputElement>(null);
  const physicalInputRef = useRef<HTMLInputElement>(null);

  // Viewport refs for calculations
  const cadContainerRef = useRef<HTMLDivElement>(null);
  const physicalContainerRef = useRef<HTMLDivElement>(null);

  const handleCadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCadImage(url);
    }
  };

  const handlePhysicalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhysicalImage(url);
    }
  };

  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement>, 
    ref: React.RefObject<HTMLDivElement | null>,
    source: 'CAD' | 'FÍSICO'
  ) => {
    if (!isMarkingMode) return;
    const container = ref.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const roundedX = parseFloat(x.toFixed(2));
    const roundedY = parseFloat(y.toFixed(2));

    const newGap: Gap = {
      id: `gap-${Date.now()}`,
      x: roundedX,
      y: roundedY,
      timestamp: new Date().toISOString()
    };

    onAddGap(newGap);
    setLastMarkedMessage(`Ponto discrepante adicionado em: [X: ${roundedX}%, Y: ${roundedY}%] (${source})`);
    
    // Clear notification after a few seconds
    setTimeout(() => {
      setLastMarkedMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* HUD Info Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface border border-outline-variant p-4 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-analysis-bold text-[13px] text-primary">MODO: CONFRONTO EVIDENCIAL</span>
            <span className="bg-secondary text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold">
              ATIRADOR COGNITIVO ATIVO
            </span>
          </div>
          <p className="font-mono text-xs text-on-surface-variant">
            Arraste o slider para calibrar a transparência e clique em 'Marcar gap manualmente' para registrar o espaço físico.
          </p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto font-mono text-xs">
          <button
            onClick={() => cadInputRef.current?.click()}
            className="flex-1 sm:flex-none border border-outline-variant px-3 py-1.5 hover:bg-surface-container-high active:translate-y-0.5 text-center transition-colors text-[11px]"
          >
            IMPORTAR CAD
          </button>
          <button
            onClick={() => physicalInputRef.current?.click()}
            className="flex-1 sm:flex-none border border-outline-variant px-3 py-1.5 hover:bg-surface-container-high active:translate-y-0.5 text-center transition-colors text-[11px]"
          >
            UPLOAD FOTO
          </button>
          <input
            ref={cadInputRef}
            type="file"
            accept="image/*"
            onChange={handleCadUpload}
            className="hidden"
          />
          <input
            ref={physicalInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhysicalUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Dual Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-outline bg-surface-container-lowest">
        {/* Left Viewport - PROJETO CAD */}
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-outline relative">
          <div className="bg-surface-container px-4 py-2 flex justify-between items-center border-b border-outline">
            <span className="font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider">
              [PAINEL 01] PROJETO CAD
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant">
              [COORD_SYS: MODEL_XYZ]
            </span>
          </div>

          <div
            ref={cadContainerRef}
            onClick={(e) => handleImageClick(e, cadContainerRef, 'CAD')}
            className={`min-h-[380px] h-[400px] relative bg-surface-dim overflow-hidden select-none ${
              isMarkingMode ? 'cursor-crosshair ring-2 ring-inset ring-secondary' : 'cursor-default'
            }`}
          >
            {/* The CAD image */}
            <img
              src={cadImage}
              alt="Technical CAD render"
              className="w-full h-full object-contain grayscale mix-blend-multiply opacity-80"
              referrerPolicy="no-referrer"
            />

            {/* Optional Overlay visualizer stacking right on top of CAD inside CAD container */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-150"
              style={{ opacity: overlayOpacity / 100 }}
            >
              <img
                src={physicalImage}
                alt="Stacked physical overlay"
                className="w-full h-full object-contain grayscale mix-blend-screen"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Hover Indicator inside marking mode */}
            {isMarkingMode && (
              <div className="absolute top-2 right-2 bg-secondary text-white font-mono text-[9px] px-2 py-1 uppercase font-bold animate-pulse z-20">
                CLIQUE PARA REGISTRAR COORD_GAP
              </div>
            )}

            {/* Visual markers representing user registered gaps */}
            {gaps.map((g) => (
              <div
                key={g.id}
                className="absolute w-4 h-4 -ml-2 -mt-2 border-2 border-secondary rounded-full flex items-center justify-center animate-ping z-10"
                style={{ left: `${g.x}%`, top: `${g.y}%` }}
              >
                <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
              </div>
            ))}
            {gaps.map((g) => (
              <div
                key={`static-${g.id}`}
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 border border-primary bg-secondary/20 hover:bg-secondary/40 text-secondary text-[8px] flex items-center justify-center font-bold font-mono rounded-none z-10 cursor-pointer"
                style={{ left: `${g.x}%`, top: `${g.y}%` }}
                title={`Gap: X=${g.x} Y=${g.y}`}
              >
                ✖
              </div>
            ))}

            {/* HUD technical data stamp */}
            <div className="absolute bottom-4 left-4 p-2 bg-surface/85 border border-outline font-mono text-[9px] leading-tight select-none">
              RENDER: WIREFRAME_HD<br />
              DENSITY: 0.004mm
            </div>
          </div>
        </div>

        {/* Right Viewport - OBJETO FÍSICO */}
        <div className="flex flex-col relative">
          <div className="bg-surface-container px-4 py-2 flex justify-between items-center border-b border-outline">
            <span className="font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider">
              [PAINEL 02] OBJETO FÍSICO
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant">
              [SENSOR: OPTICAL_FORENSIC]
            </span>
          </div>

          <div
            ref={physicalContainerRef}
            onClick={(e) => handleImageClick(e, physicalContainerRef, 'FÍSICO')}
            className={`min-h-[380px] h-[400px] relative bg-surface-dim overflow-hidden select-none ${
              isMarkingMode ? 'cursor-crosshair ring-2 ring-inset ring-secondary' : 'cursor-default'
            }`}
          >
            {/* The physical reality photo */}
            <img
              src={physicalImage}
              alt="Industrial Forensics Close"
              className="w-full h-full object-contain grayscale"
              referrerPolicy="no-referrer"
            />

            {/* Overlaid CAD inside physical container to support dual visual comparison style */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-150"
              style={{ opacity: (100 - overlayOpacity) / 100 }}
            >
              <img
                src={cadImage}
                alt="Stacked details overlay"
                className="w-full h-full object-contain grayscale mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Scanning graphic line effect */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-secondary/35 animate-[bounce_6s_infinite] pointer-events-none"></div>

            {/* Render markers here too */}
            {gaps.map((g) => (
              <div
                key={`phys-${g.id}`}
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 border border-primary bg-secondary/20 hover:bg-secondary/40 text-secondary text-[8px] flex items-center justify-center font-bold font-mono rounded-none z-10 cursor-pointer"
                style={{ left: `${g.x}%`, top: `${g.y}%` }}
                title={`Gap: X=${g.x} Y=${g.y}`}
              >
                ✖
              </div>
            ))}

            {/* HUD technical data stamp */}
            <div className="absolute bottom-4 right-4 p-2 bg-surface/85 border border-outline font-mono text-[9px] leading-tight select-none text-right">
              CAPTURE_ID: CAPTURE_A23<br />
              RAW_FORMAT: NO_CORRECT_EXIF
            </div>
          </div>
        </div>
      </div>

      {/* Floating alignment control panel (cognitive-friction mechanism) */}
      <div className="bg-surface border border-primary p-4 space-y-4">
        {/* Opposing Drag Layer opacity simulation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="overlay-slider" className="font-sans font-bold text-outline uppercase tracking-wider text-[11px]">
              CONTROLE DE SOBREPOSIÇÃO (AJUSTAR TRANSPARÊNCIA)
            </label>
            <span className="font-mono font-bold text-secondary text-sm bg-surface-container px-2 py-0.5 border border-outline-variant">
              CAD &rarr; {100 - overlayOpacity}% | FÍSTICO &rarr; {overlayOpacity}%
            </span>
          </div>
          <input
            type="range"
            id="overlay-slider"
            min="0"
            max="100"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            className="w-full h-2 bg-surface-container rounded-none appearance-none cursor-ew-resize accent-secondary border border-outline-variant"
          />
        </div>

        {/* State Indicators & Critical Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pt-2">
          <div className="font-mono text-xs text-on-surface-variant flex flex-col gap-1 sm:max-w-md">
            <div>
              [GAP MARMADOS]: <strong className="text-primary font-bold">{gaps.length} localizações registradas</strong>
            </div>
            {lastMarkedMessage ? (
              <div className="text-secondary font-bold text-[11px] animate-pulse">
                {lastMarkedMessage}
              </div>
            ) : (
              <div className="text-[10px] text-outline">
                Clique em 'MARCAR GAP MANUALMENTE' e clique diretamente em qualquer painel para colher coordenadas.
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {gaps.length > 0 && (
              <button
                onClick={onClearGaps}
                id="clear-gaps-btn"
                className="px-4 py-3 border border-outline text-outline font-mono text-[11px] tracking-wide hover:bg-surface-container bg-surface-container-lowest uppercase transition-all"
              >
                LIMPAR HISTÓRICO DE GAPS
              </button>
            )}
            <button
              onClick={() => setIsMarkingMode(!isMarkingMode)}
              id="toggle-marking-mode-btn"
              className={`px-6 py-3 font-mono font-bold text-xs tracking-wider border transition-all uppercase flex items-center justify-center gap-2 ${
                isMarkingMode
                  ? 'bg-secondary text-white border-primary'
                  : 'bg-primary text-white border-primary hover:bg-secondary hover:border-secondary'
              }`}
            >
              <span className="inline-block animate-pulse">●</span>
              {isMarkingMode ? 'PARAR MARCAÇÃO DE GAPS' : 'MARCAR GAP MANUALMENTE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

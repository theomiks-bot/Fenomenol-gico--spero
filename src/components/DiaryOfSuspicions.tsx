import React, { useState } from 'react';
import { SuspicionEntry, Gap } from '../types';

interface DiaryOfSuspicionsProps {
  entries: SuspicionEntry[];
  gaps: Gap[];
  onAddEntry: (entry: SuspicionEntry) => void;
  onClearEntries: () => void;
  onEndSession: () => void;
}

export function DiaryOfSuspicions({
  entries,
  gaps,
  onAddEntry,
  onClearEntries,
  onEndSession
}: DiaryOfSuspicionsProps) {
  const [newText, setNewText] = useState('Eu declaro que este [componente] parece ter sido otimizado para vida curta na junção X.');
  const [selectedCoordIndex, setSelectedCoordIndex] = useState<string>('manual');
  const [manualX, setManualX] = useState<number>(0);
  const [manualY, setManualY] = useState<number>(0);
  const [entryStatus, setEntryStatus] = useState<'VERIFICADO' | 'PENDENTE'>('VERIFICADO');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const handleVoiceInput = () => {
    setIsRecordingVoice(true);
    // Simulate high-fidelity forensic audio translation delay
    setTimeout(() => {
      const templates = [
        "Eu declaro que a micro-fissura observada na zona térmica 3 não condiz com as especificações de fadiga declaradas pelo fabricante OEM.",
        "Eu declaro que este rotor parece ter sido otimizado para vida curta na junção de torque central.",
        "Eu declaro que houve uma substituição não documentada de componentes de vedação por polímeros de categoria inferior na bomba secundária.",
        "Eu declaro que a leitura de pressão exibe um jitter sistemático, sugerindo bypass de sensor físico por emulação de software."
      ];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setNewText(randomTemplate);
      setIsRecordingVoice(false);
    }, 2200);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    let coords: { x: number; y: number } | null = null;
    if (selectedCoordIndex === 'manual') {
      coords = { x: manualX, y: manualY };
    } else {
      const chosenGap = gaps.find(g => g.id === selectedCoordIndex);
      if (chosenGap) {
        coords = { x: chosenGap.x, y: chosenGap.y };
      }
    }

    // Capture standard ISO-like timestamp
    const now = new Date();
    const formattedTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');

    const newEntry: SuspicionEntry = {
      id: `entry-${Date.now()}`,
      timestamp: formattedTimestamp,
      coordinates: coords,
      text: newText,
      status: entryStatus
    };

    onAddEntry(newEntry);
    setNewText('Eu declaro que este [componente] parece ter sido otimizado para vida curta na junção X.');
  };

  const exportAsTxt = () => {
    if (entries.length === 0) {
      alert("Nenhum registro para exportar.");
      return;
    }
    let content = '=== HISTÓRICO DE RASTREABILIDADE - DDF ===\r\n';
    content += `Emitido em: ${new Date().toISOString()}\r\n`;
    content += `Analista Ativo\r\n\r\n`;

    entries.forEach((entry, idx) => {
      const coordsStr = entry.coordinates 
        ? `X: ${entry.coordinates.x}%, Y: ${entry.coordinates.y}%` 
        : 'SEM COORDENADAS';
      content += `[Entrada #${idx + 1}] [${entry.timestamp}] [Status: ${entry.status}]\r\n`;
      content += `Coordenadas: ${coordsStr}\r\n`;
      content += `Declaração: "${entry.text}"\r\n`;
      content += '--------------------------------------------------\r\n\r\n';
    });

    const fileBlob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(fileBlob);
    element.download = `DDF-HISTORICO-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportAsCsv = () => {
    if (entries.length === 0) {
      alert("Nenhum registro para exportar.");
      return;
    }
    let csvContent = 'ID;TIMESTAMP;STATUS;GAP_X;GAP_Y;DECLARACAO\r\n';
    entries.forEach((entry, idx) => {
      const x = entry.coordinates ? entry.coordinates.x : '';
      const y = entry.coordinates ? entry.coordinates.y : '';
      // Escape semicolons and double quotes
      const escapedText = entry.text.replace(/"/g, '""');
      csvContent += `${entry.id};"${entry.timestamp}";"${entry.status}";"${x}";"${y}";"${escapedText}"\r\n`;
    });

    const fileBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(fileBlob);
    element.download = `DDF-HISTORICO-${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-6 bg-background">
      {/* Sidebar - Add Suspicions Entry form (Intellectual Workbench) */}
      <aside className="col-span-12 lg:col-span-4 mb-8 lg:mb-0 space-y-6">
        <div className="border border-outline p-6 bg-surface-container-low">
          <p className="font-mono text-[10px] text-outline font-bold tracking-widest uppercase mb-4">
            [ REGISTRAR NOVA SUSPEITA ]
          </p>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            {/* Template input/Text Input Area */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-outline-variant uppercase">
                Análise Textual / Declaração:
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-mono text-xs text-primary focus:outline-none focus:border-secondary transition-all h-[120px] resize-none"
                placeholder="Eu declaro..."
                required
              />
              <div className="flex justify-between items-center text-[9px] text-outline font-mono">
                <span>REQUISITO: MONOSPACED</span>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isRecordingVoice}
                  className="text-secondary font-bold underline uppercase hover:text-primary transition-colors cursor-pointer"
                >
                  {isRecordingVoice ? '[ GRAVANDO ÁUDIO... ]' : '[ SIMULAR ENTRADA DE VOZ ]'}
                </button>
              </div>
            </div>

            {/* Coordinates selector linked with marked gaps */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-outline-variant uppercase">
                Acoplar Coordenadas do GAP (Screen 1):
              </label>
              <select
                value={selectedCoordIndex}
                onChange={(e) => setSelectedCoordIndex(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-primary focus:outline-none focus:border-secondary transition-all"
              >
                <option value="manual">INSERIR COORDENADAS MANUAIS</option>
                {gaps.map((gap, i) => (
                  <option key={gap.id} value={gap.id}>
                    GAP #{i + 1} &rarr; [X: {gap.x}%, Y: {gap.y}%]
                  </option>
                ))}
              </select>
            </div>

            {selectedCoordIndex === 'manual' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-outline font-bold">COORD X (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={manualX}
                    onChange={(e) => setManualX(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-outline font-bold">COORD Y (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={manualY}
                    onChange={(e) => setManualY(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-primary focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            )}

            {/* Status Select */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-outline-variant uppercase">
                Estado da Auditoria:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEntryStatus('VERIFICADO')}
                  className={`py-2 text-[11px] font-mono font-bold border transition-colors ${
                    entryStatus === 'VERIFICADO'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline hover:bg-surface-container-low'
                  }`}
                >
                  VERIFICADO
                </button>
                <button
                  type="button"
                  onClick={() => setEntryStatus('PENDENTE')}
                  className={`py-2 text-[11px] font-mono font-bold border transition-colors ${
                    entryStatus === 'PENDENTE'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline hover:bg-surface-container-low'
                  }`}
                >
                  PENDENTE
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-secondary text-white font-mono font-bold text-xs tracking-wider border border-secondary hover:bg-opacity-90 transition-all uppercase active:translate-y-0.5"
            >
              REGISTRAR SUSPEITA
            </button>
          </form>
        </div>

        {/* System parameters feedback */}
        <div className="border border-outline p-4 bg-surface-container-lowest space-y-2 select-none">
          <p className="font-mono text-[10px] text-outline font-bold uppercase tracking-wider">
            [ METADADOS DE INTEGRIDADE ]
          </p>
          <div className="space-y-1 font-mono text-[11px] text-on-surface-variant">
            <div className="flex justify-between">
              <span>SESSÃO:</span>
              <span className="font-bold">#DDF-2026-XQ</span>
            </div>
            <div className="flex justify-between">
              <span>INTEGRIDADE:</span>
              <span className="text-secondary font-bold font-mono">[SENSORIAL_NOMINAL]</span>
            </div>
            <div className="flex justify-between">
              <span>CONTROLE:</span>
              <span className="font-bold">OFFLINE_LOCAL</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Track Timeline Section */}
      <section className="col-span-12 lg:col-span-8 relative">
        <div className="flex items-center justify-between mb-6 border-b border-outline pb-2">
          <h2 className="font-sans text-xl font-extrabold text-primary tracking-tight uppercase">
            HISTÓRICO DE RASTREABILIDADE
          </h2>
          <span className="font-mono text-[11px] text-outline bg-surface-container px-2.5 py-1">
            [TOTAL: {entries.length} ENTRADAS]
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="border-2 border-dashed border-outline-variant p-10 text-center text-xs text-outline italic font-mono select-none">
            [ NENHUMA DECLARAÇÃO DE SUSPEITA SALVA NESTE DISPOSITIVO ]
            <p className="not-italic text-[10px] text-outline-variant mt-2">
              Utilize o painel esquerdo para formular e registar sua percepção forense.
            </p>
          </div>
        ) : (
          <div className="relative pl-8 space-y-8">
            {/* Timeline connection line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-outline-variant z-0" />

            {entries.map((entry) => (
              <article key={entry.id} className="relative z-10">
                {/* Micro-dot marking coordinates color */}
                <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-background border border-outline flex items-center justify-center">
                  <span className={`w-1.5 h-1.5 ${entry.status === 'VERIFICADO' ? 'bg-secondary' : 'bg-primary'}`}></span>
                </div>

                <div className="border border-outline bg-surface-container-lowest p-5 space-y-3 shadow-none">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-2 gap-2 font-mono text-[11px]">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-secondary font-bold">{entry.timestamp}</span>
                      <span className="text-[10px] bg-surface-container px-2 py-0.5 text-on-surface-variant font-bold">
                        COORD {entry.coordinates ? `[X: ${Math.round(entry.coordinates.x)}%, Y: ${Math.round(entry.coordinates.y)}%]` : '[COORDENADA_NULA]'}
                      </span>
                    </div>

                    <span className={`text-[9px] font-bold border px-2 py-0.5 ${
                      entry.status === 'VERIFICADO' 
                        ? 'text-secondary border-secondary bg-secondary/5' 
                        : 'text-primary border-primary bg-surface'
                    }`}>
                      {entry.status}
                    </span>
                  </div>

                  <p className="font-mono text-xs leading-relaxed italic bg-surface p-4 border-l-2 border-secondary select-all">
                    "{entry.text}"
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Batch Export Options */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-outline-variant pt-6 select-none">
          <button
            onClick={exportAsTxt}
            className="flex-1 h-12 flex items-center justify-center gap-2 border border-outline bg-surface-container text-on-surface hover:bg-secondary hover:text-white transition-all font-mono text-xs font-bold uppercase cursor-pointer"
          >
            <span>💾</span> EXPORTAR COMO TEXTO PURO (.TXT)
          </button>
          <button
            onClick={exportAsCsv}
            className="flex-1 h-12 flex items-center justify-center gap-2 border border-outline bg-surface-container text-on-surface hover:bg-secondary hover:text-white transition-all font-mono text-xs font-bold uppercase cursor-pointer"
          >
            <span>📊</span> EXPORTAR COMO PLANILHA (.CSV)
          </button>
          
          <button
            onClick={onEndSession}
            className="flex-1 h-12 flex items-center justify-center gap-2 border border-secondary bg-surface-container text-secondary hover:bg-secondary hover:text-white transition-all font-mono text-xs font-bold uppercase cursor-pointer"
          >
            <span>⚙️</span> ENCERRAR SESSÃO
          </button>
        </div>
      </section>
    </div>
  );
}

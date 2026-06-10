import React, { useState } from 'react';

interface CognitiveAgreementProps {
  onAccept: () => void;
}

export function CognitiveAgreement({ onAccept }: CognitiveAgreementProps) {
  const targetStatement = "Eu não delegarei meu juízo a esta interface.";
  const [typedStatement, setTypedStatement] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedStatement.trim() !== targetStatement) {
      setError(true);
      return;
    }
    if (!signature.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onAccept();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 selection:bg-secondary selection:text-white">
      <div className="max-w-2xl w-full border border-outline bg-surface-container-low p-8 shadow-none relative">
        {/* Decorative corner ticks for industrial feel */}
        <div className="absolute top-2 left-2 font-mono text-[9px] text-outline opacity-40">DDF_SYS_INIT_v2.4</div>
        <div className="absolute top-2 right-2 font-mono text-[9px] text-outline opacity-40">COORD: REF-00</div>

        <div className="border-l-4 border-primary pl-6 mb-8">
          <span className="font-sans font-bold text-xs text-secondary tracking-widest uppercase block mb-1">
            [ COMPROMISSO EPISTÊMICO MANDATÓRIO ]
          </span>
          <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight leading-none">
            TERMO DE RESPONSABILIDADE ANALÍTICA
          </h1>
        </div>

        <div className="space-y-4 text-xs font-mono text-on-surface-variant leading-relaxed text-justify mb-8">
          <p>
            Esta interface foi desenhada como um instrumento de fricção deliberada. Ela recusa-se expressamente a
            formular diagnósticos automatizados, pontuações de integridade, ou vereditos de aprovação de componentes.
            No momento em que sistemas digitais pretendem prever a falha, eles adormecem a percepção humana.
          </p>
          <p>
            O atrito introduzido aqui não é cosmético. Ao operar o <strong>DDF</strong>, você declara estar ciente de
            que a responsabilidade pela conclusão forense repousa integralmente sobre o seu escrutínio sensorial e dedutivo.
            Ao re-assinar este compromisso a cada nova sessão, você reforça a soberania do julgamento humano sobre a
            comodidade da delegação algorítmica.
          </p>
          <div className="border-y border-outline-variant py-4 bg-surface-container-lowest px-4">
            <span className="block text-primary font-bold mb-2 uppercase text-[11px] tracking-wider">
              Declaração de Isenção Tecnológica:
            </span>
            <blockquote className="italic text-secondary text-sm font-semibold select-all font-mono">
              "{targetStatement}"
            </blockquote>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-outline tracking-wider">
              1. Para prosseguir, digite exatamente a sentença de responsabilidade acima:
            </label>
            <input
              type="text"
              id="statement-input"
              value={typedStatement}
              onChange={(e) => {
                setTypedStatement(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Digite aqui..."
              className="w-full bg-surface-container-lowest border-b border-primary p-3 font-mono text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-outline tracking-wider">
              2. Nome do Analista Residente:
            </label>
            <input
              type="text"
              id="signature-input"
              value={signature}
              onChange={(e) => {
                setSignature(e.target.value);
                if (error) setError(false);
              }}
              placeholder="ASSINATURA DIGITAL (MÍNIMO 3 CARACTERES)"
              className="w-full bg-surface-container-lowest border-b border-primary p-3 font-mono text-xs text-primary focus:outline-none focus:border-secondary transition-colors uppercase"
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="p-3 bg-surface border border-secondary text-secondary text-xs font-mono leading-tight">
              [ ERRO ESPISTÊMICO ]: A entrada não corresponde precisamente à frase exigida ou o nome do analista está vazio.
              Exatidão ortográfica e gramatical é requerida como primeiro nível de rigor profissional.
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
            <div className="text-[10px] text-outline text-center sm:text-left leading-normal font-mono">
              STATUS DE CONTROLE: RETIDO NA ASSINATURA<br />
              DDF SYSTEM ACCESS RESTRICTED
            </div>
            <button
              type="submit"
              id="enter-system-btn"
              className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-sans text-xs font-bold tracking-widest border border-primary hover:bg-secondary hover:border-secondary hover:text-white transition-all active:translate-y-0.5 uppercase"
            >
              ATIVAR CANAL DE ANÁLISE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

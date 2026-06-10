import React, { useState } from 'react';
import { Question } from '../types';

interface InterrogativeQuestionsProps {
  questions: Question[];
  onSaveAnswers: (answers: Record<string, string>) => void;
  savedAnswers: Record<string, string>;
  skippedQuestionId: string | null;
  onSetSkippedQuestionId: (id: string | null) => void;
}

export function InterrogativeQuestions({
  questions,
  onSaveAnswers,
  savedAnswers,
  skippedQuestionId,
  onSetSkippedQuestionId,
}: InterrogativeQuestionsProps) {
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(savedAnswers);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleInputChange = (questionId: string, text: string) => {
    const updated = { ...localAnswers, [questionId]: text };
    setLocalAnswers(updated);
    onSaveAnswers(updated);
  };

  const skipCountRemaining = skippedQuestionId ? 0 : 1;

  const handleSkipQuestion = (questionId: string) => {
    if (skipCountRemaining <= 0) {
      alert("Não é permitido pular mais de 1 pergunta por sessão acadêmica (limite de atrito cognitivo atingido).");
      return;
    }
    onSetSkippedQuestionId(questionId);
    // Clear answer of skipped question if any
    const updated = { ...localAnswers };
    delete updated[questionId];
    setLocalAnswers(updated);
    onSaveAnswers(updated);
  };

  const handleUnskipQuestion = (questionId: string) => {
    onSetSkippedQuestionId(null);
  };

  const handleSaveBtnClick = () => {
    // Save answers explicitly
    onSaveAnswers(localAnswers);
    setSaveStatus("RESPOSTAS PARCIAIS REGISTRADAS NO DIÁRIO");
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      {/* Forensic Introduction */}
      <div className="border-l-4 border-primary pl-6 mb-8 py-2">
        <span className="font-sans font-bold text-xs text-secondary tracking-widest uppercase block mb-1">
          [ MÓDULO DE INTERROGAÇÃO TÉCNICA ]
        </span>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight leading-none mb-2">
          Diagnóstico de Falhas de Design
        </h1>
        <p className="font-mono text-xs text-on-surface-variant max-w-xl">
          O processo de interrogação exige honestidade estrutural. Identifique os pontos de fricção e negligência de manutenção abaixo.
        </p>
      </div>

      {/* Internal question rendering */}
      <div className="space-y-10">
        {questions.map((q, idx) => {
          const isSkipped = skippedQuestionId === q.id;
          const isAnswered = (localAnswers[q.id]?.trim() || '').length > 0;

          return (
            <section
              key={q.id}
              className={`border p-6 transition-all duration-150 ${
                isSkipped
                  ? 'border-dashed border-outline bg-surface-container opacity-50'
                  : isAnswered
                  ? 'border-secondary bg-surface-container-low'
                  : 'border-outline bg-surface-container-low'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start sm:items-center gap-4">
                  <span className="font-mono font-bold text-sm bg-primary text-white px-2.5 py-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <label className="font-mono font-bold text-[13px] text-primary uppercase tracking-wider leading-snug">
                    "{q.text}"
                  </label>
                </div>

                {/* Skip button logic */}
                <div className="font-mono text-xs self-end sm:self-auto">
                  {isSkipped ? (
                    <button
                      onClick={() => handleUnskipQuestion(q.id)}
                      className="text-secondary font-bold underline bg-transparent border-none text-[11px] cursor-pointer"
                    >
                      [ REINCLUIR PERGUNTA ]
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSkipQuestion(q.id)}
                      disabled={skipCountRemaining <= 0}
                      className={`text-[11px] underline font-bold uppercase transition-all ${
                        skipCountRemaining > 0 
                          ? 'text-on-surface-variant hover:text-primary cursor-pointer' 
                          : 'text-outline cursor-not-allowed opacity-40'
                      }`}
                    >
                      Pular Pergunta ({skipCountRemaining} restante)
                    </button>
                  )}
                </div>
              </div>

              {!isSkipped ? (
                <div className="relative mt-2">
                  <textarea
                    value={localAnswers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full min-h-[120px] bg-transparent border-0 border-b border-primary focus:border-b-2 focus:border-secondary transition-all outline-none font-mono text-xs text-primary py-2 resize-none placeholder:text-outline-variant placeholder:opacity-75 focus:ring-0"
                    placeholder={q.placeholder || 'Digite as observações técnicas aqui...'}
                  />
                  <div className="flex justify-between items-center text-[10px] text-outline mt-1 font-mono">
                    <span>CARACTERES REGISTRADOS: {(localAnswers[q.id] || '').length}</span>
                    <span>TIPO: MONOSPACED_ARCHIVAL</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-outline italic font-mono select-none">
                  [ ESTA PERGUNTA FOI PULADA DELIBERADAMENTE PELO ANALISTA ]
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Save action with cognitive force feedback */}
      <div className="mt-12 flex flex-col items-center gap-6 border-t border-outline-variant pt-8">
        <button
          onClick={handleSaveBtnClick}
          id="register-answers-btn"
          className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary font-sans text-xs font-bold tracking-widest border border-primary hover:bg-secondary hover:border-secondary transition-all active:translate-y-0.5 uppercase"
        >
          REGISTRAR RESPOSTAS
        </button>

        {saveStatus && (
          <span className="font-mono text-xs text-secondary font-bold animate-pulse">
            [ {saveStatus} ]
          </span>
        )}
      </div>
    </div>
  );
}

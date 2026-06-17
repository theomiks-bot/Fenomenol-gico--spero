import React, { useState, useEffect } from 'react';
import { ScreenType, Gap, SuspicionEntry, Question } from './types';
import { CognitiveAgreement } from './components/CognitiveAgreement';
import { EvidentialConfrontation } from './components/EvidentialConfrontation';
import { InterrogativeQuestions } from './components/InterrogativeQuestions';
import { DiaryOfSuspicions } from './components/DiaryOfSuspicions';
import { BlindMode } from './components/BlindMode';
import { AuthForm } from './components/AuthForm';
import { getRandomQuestions } from './questionsBank';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('AGREEMENT');
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [skippedQuestionId, setSkippedQuestionId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Initialize diary entries with the high-fidelity screenshot records
  const [entries, setEntries] = useState<SuspicionEntry[]>([
    {
      id: 'entry-1',
      timestamp: '2023-10-24 14:22:10',
      coordinates: { x: 23, y: 11 },
      text: 'Eu declaro que este rotor parece ter sido otimizado para vida curta na junção de torque central.',
      status: 'VERIFICADO'
    },
    {
      id: 'entry-2',
      timestamp: '2023-10-24 15:05:44',
      coordinates: { x: 88, y: 94 },
      text: 'Eu declaro que a micro-fissura observada na zona térmica 3 não condiz com as especificações de fadiga declaradas pelo fabricante OEM.',
      status: 'PENDENTE'
    },
    {
      id: 'entry-3',
      timestamp: '2023-10-24 16:40:12',
      coordinates: { x: 41, y: 30 },
      text: 'Eu declaro que houve uma substituição não documentada de componentes de vedação por polímeros de categoria inferior na bomba secundária.',
      status: 'VERIFICADO'
    },
    {
      id: 'entry-4',
      timestamp: '2023-10-24 17:12:01',
      coordinates: { x: 10, y: 99 },
      text: 'Eu declaro que a leitura de pressão exibe um jitter sistemático, sugerindo bypass de sensor físico por emulação de software.',
      status: 'VERIFICADO'
    }
  ]);

  // Load questions once on mount
  useEffect(() => {
    setQuestions(getRandomQuestions(3));
  }, []);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUserEmail(data.session?.user?.email ?? null);
      if (data.session) {
        setScreen('TRACEABILITY');
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserEmail(session?.user?.email ?? null);
      if (session) {
        setScreen('TRACEABILITY');
      } else {
        setScreen('AUTH');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAcceptAgreement = () => {
    setScreen('AUTH');
  };

  const handleAddGap = (gap: Gap) => {
    setGaps(prev => [...prev, gap]);
  };

  const handleClearGaps = () => {
    setGaps([]);
  };

  const handleAddEntry = (entry: SuspicionEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const handleClearEntries = () => {
    setEntries([]);
  };

  const handleEndSession = () => {
    if (confirm("Deseja realmente encerrar a sessão de auditoria? Todos os estados duráveis locais serão redefinidos de acordo com o protocolo de atrito cognitivo.")) {
      setScreen('AGREEMENT');
      setGaps([]);
      setSavedAnswers({});
      setSkippedQuestionId(null);
      // Reload a fresh set of questions for the next forensic analyst
      setQuestions(getRandomQuestions(3));
    }
  };

  const handleRegisterBlindAnalysis = (observationsText: string, label: string) => {
    // Generate automated entry log for suspicion diary
    const now = new Date();
    const formattedTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');

    const blindEntry: SuspicionEntry = {
      id: `blind-${Date.now()}`,
      timestamp: formattedTimestamp,
      coordinates: null,
      text: `[RETRATO CEGO OBS]: "${observationsText}" | [REVELAÇÃO]: ${label}`,
      status: 'VERIFICADO'
    };

    setEntries(prev => [blindEntry, ...prev]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserEmail(null);
    setScreen('AUTH');
  };

  const handleAuthSuccess = () => {
    setScreen('TRACEABILITY');
  };

  // Render subscreen conditionally
  const renderScreenContent = () => {
    switch (screen) {
      case 'CONFRONTATION':
        return (
          <EvidentialConfrontation
            gaps={gaps}
            onAddGap={handleAddGap}
            onClearGaps={handleClearGaps}
          />
        );
      case 'QUESTIONS':
        return (
          <InterrogativeQuestions
            questions={questions}
            savedAnswers={savedAnswers}
            onSaveAnswers={setSavedAnswers}
            skippedQuestionId={skippedQuestionId}
            onSetSkippedQuestionId={setSkippedQuestionId}
          />
        );
      case 'TRACEABILITY':
        return (
          <DiaryOfSuspicions
            entries={entries}
            gaps={gaps}
            onAddEntry={handleAddEntry}
            onClearEntries={handleClearEntries}
            onEndSession={handleEndSession}
          />
        );
      case 'BLIND_MODE':
        return (
          <BlindMode
            onRegisterAnalysis={handleRegisterBlindAnalysis}
          />
        );
      case 'AUTH':
        return <AuthForm />;
      default:
        return null;
    }
  };

  // Get current screen title text for industrial TopAppBar
  const getHeaderTitle = () => {
    switch (screen) {
      case 'AUTH':
        return 'DDF - AUTENTICAÇÃO';
      case 'CONFRONTATION':
        return 'DDF - ANALYSER';
      case 'QUESTIONS':
        return 'DDF - INTERROGAÇÃO';
      case 'TRACEABILITY':
        return 'DDF - DIÁRIO';
      case 'BLIND_MODE':
        return 'DDF - ANÁLISE CEGA';
      default:
        return 'DDF';
    }
  };

  // Skip rendering standard headers during Agreement checkpoint
  if (screen === 'AGREEMENT') {
    return <CognitiveAgreement onAccept={handleAcceptAgreement} />;
  }

  if (screen === 'AUTH') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-mono antialiased">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center px-6 h-12 w-full bg-surface border-b border-outline-variant sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-primary tracking-tight">{getHeaderTitle()}</span>
          <span className="hidden sm:inline-block px-2 py-0.5 border border-primary text-[9px] font-mono">
            v2.4.0_STABLE
          </span>
        </div>

        {/* Top Desktop navigation links */}
        <div className="flex items-center gap-1 h-full font-sans text-xs">
          <button
            onClick={() => setScreen('CONFRONTATION')}
            className={`px-3 py-1.5 transition-colors font-bold ${
              screen === 'CONFRONTATION' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            CONFRONTO
          </button>
          <button
            onClick={() => setScreen('QUESTIONS')}
            className={`px-3 py-1.5 transition-colors font-bold ${
              screen === 'QUESTIONS' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            INTERROGAÇÃO
          </button>
          <button
            onClick={() => setScreen('TRACEABILITY')}
            className={`px-3 py-1.5 transition-colors font-bold ${
              screen === 'TRACEABILITY' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            RASTREABILIDADE
          </button>
          <button
            onClick={() => setScreen('BLIND_MODE')}
            className={`px-3 py-1.5 transition-colors font-bold ${
              screen === 'BLIND_MODE' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            ANÁLISE CEGA
          </button>
          {session ? (
            <>
              <span className="font-semibold text-on-surface-variant">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="font-bold px-3 py-1.5 text-outline hover:text-primary border-l border-outline-variant"
              >
                SAIR
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setScreen('AUTH')}
                className={`font-bold px-3 py-1.5 border-l border-outline-variant ${
                  screen === 'AUTH' ? 'text-secondary border-b-2 border-secondary' : 'text-outline hover:text-primary'
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setScreen('AGREEMENT')}
                className="font-bold text-outline hover:text-primary ml-2 px-3 py-1.5 border-l border-outline-variant"
              >
                RETORNAR
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Work Space Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 pb-24 md:pb-12">
        {renderScreenContent()}
      </main>

      {/* Persistent Bottom Bar for mobile/quick operations */}
      <nav className="fixed bottom-0 left-0 w-full h-16 flex justify-around items-center bg-surface border-t-2 border-primary z-50">
        <button
          onClick={() => setScreen('TRACEABILITY')}
          className={`flex flex-col items-center justify-center p-2 flex-1 h-full transition-colors ${
            screen === 'TRACEABILITY' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="font-bold text-[18px]">⚠️</span>
          <span className="font-sans font-bold text-[10px] tracking-wider mt-1 uppercase">
            REGISTRAR SUSPEITA
          </span>
        </button>

        <button
          onClick={() => setScreen('CONFRONTATION')}
          className={`flex flex-col items-center justify-center p-2 flex-1 h-full transition-colors ${
            screen === 'CONFRONTATION' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="font-bold text-[18px]">📐</span>
          <span className="font-sans font-bold text-[10px] tracking-wider mt-1 uppercase">
            MARCAR GAP
          </span>
        </button>

        <button
          onClick={() => setScreen('BLIND_MODE')}
          className={`flex flex-col items-center justify-center p-2 flex-1 h-full transition-colors ${
            screen === 'BLIND_MODE' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="font-bold text-[18px]">📄</span>
          <span className="font-sans font-bold text-[10px] tracking-wider mt-1 uppercase">
            GERAR RELATÓRIO
          </span>
        </button>
      </nav>

      {/* Floating Operative Badge (Desktop only) */}
      <div className="hidden lg:flex fixed bottom-8 right-8 flex-col items-end gap-1 pointer-events-none opacity-45 select-none z-30">
        <div className="bg-primary text-white px-3 py-1 font-mono text-[9px] tracking-wider font-bold">
          DDF OPERATIONAL WORKFLOW v2.4
        </div>
        <div className="bg-outline text-white px-3 py-1 font-mono text-[9px] tracking-wider">
          RESTAURANDO SOBERANIA DO JUÍZO HUMANO
        </div>
      </div>
    </div>
  );
}

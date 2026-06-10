import { Question } from './types';

export const QUESTIONS_BANK: Question[] = [
  {
    id: 'q1',
    text: 'Onde isso já falhou antes e você não sabia até tocar?',
    placeholder: 'Descreva a falha invisível detectada pelo tato ou proximidade estrutural...'
  },
  {
    id: 'q2',
    text: 'Que parte deste objeto parece projetada por quem nunca limpou um resíduo gorduroso?',
    placeholder: 'Identifique reentrâncias, texturas ou ângulos que acumulam detritos sem acesso fácil...'
  },
  {
    id: 'q3',
    text: 'Se você tivesse que reparar isto com uma faca e fita, onde começaria?',
    placeholder: 'Aponte o ponto de acesso crítico ou a vulnerabilidade mais óbvia do invólucro...'
  },
  {
    id: 'q4',
    text: 'Quais cantos afiados ou transições de perfil acumularão estresse mecânico sob vibração contínua?',
    placeholder: 'Indique se há raios de concordância insuficientes ou transições repentinas de espessura...'
  },
  {
    id: 'q5',
    text: 'Se este componente operar em um ambiente com umidade e fuligem, onde a oxidação galvânica atacará primeiro?',
    placeholder: 'Analise o contato entre metais dissimilares e áreas de retenção de líquidos...'
  },
  {
    id: 'q6',
    text: 'Qual elemento deste arranjo foi claramente projetado para facilitar a montagem fabril em detrimento da desmontagem para reparo?',
    placeholder: 'Avalie travas plásticas irreversíveis, adesivos estruturais ou parafusos inacessíveis...'
  },
  {
    id: 'q7',
    text: 'Identifique o elemento cuja espessura de parede parece ter sido reduzida ao limite absoluto para poupar centavos de matéria-prima.',
    placeholder: 'Descreva áreas finas que se deformam sob pressão manual moderada...'
  }
];

export function getRandomQuestions(count = 3): Question[] {
  // Shuffle and pick
  const shuffled = [...QUESTIONS_BANK].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

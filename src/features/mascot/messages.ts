import type { MascotMood } from './moodEngine';

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function withName(text: string, name: string): string {
  return text.replace('{name}', name);
}

const MOOD_MESSAGES: Record<MascotMood, string[]> = {
  feliz: [
    '¡Guau! Hoy ya la estás rompiendo, {name} 🐾',
    'Me encanta cuando jugamos a las tareas 🐶💛',
    '¡Eso es! Un pasito más, campeona.',
    'Orgulloso de ti, en serio, {name}.',
  ],
  neutral: [
    'Aquí estoy, contigo, sin apuro.',
    'Cuando quieras empezamos algo chiquito 🐾',
    'Todo bien, {name}. Vamos con calma hoy.',
    'Tú decides el ritmo, yo te acompaño.',
  ],
  preocupado: [
    '¿Elegimos algo pequeñito para empezar? Tú puedes, {name} 💛',
    'No pasa nada si vas lento, solo no te olvides de mí ni de ti.',
    '¿Un empujoncito? Estoy aquí para eso.',
  ],
  triste: [
    'Te extrañé hoy, {name}... ¿mañana jugamos un rato? 💛',
    'No importa, mañana es un día nuevo. Aquí sigo.',
    'Un día flojo no borra todo lo demás que sí lograste.',
  ],
};

export function moodMessage(mood: MascotMood, name = 'Chiwawita'): string {
  return withName(pick(MOOD_MESSAGES[mood]), name);
}

export const TASK_DONE_MESSAGES = [
  '¡Listo! Chiwawapunto ganado 🐾',
  'Uno menos, ¡vamos bien!',
  '¡Así se hace!',
  'Eso cuenta, y cuenta mucho.',
];

export const BIG_TASK_DONE_MESSAGES = [
  '¡Guau, esa era grande! Estoy súper orgulloso 🐶',
  '¡Lo lograste! Eso no era fácil.',
  'Eso merece más que un aplauso 🎉',
];

export const STREAK_MILESTONE_MESSAGES: Record<number, string> = {
  3: '¡3 días seguidos! Ya somos equipo 🔥',
  7: '¡Una semana entera! Impresionante 🔥',
  14: '¡Dos semanas! No te vas a librar de mí ahora 🐾',
  30: '¡Un mes! Esto ya es costumbre bonita 💛',
  60: '¡60 días! Wow, de verdad wow.',
  100: '¡100 días! Eres una máquina, y yo tu fan número uno 🐶',
};

const BAGCHECK_COMPLETE_MESSAGES_RAW = [
  '¿Segura que tienes tus llaves, {name}? 🐶🔑',
  '¡Todo listo! Ve con cuidado, te quiero.',
  'Bolso completo. Ahora sí, a conquistar el día, {name}.',
];

export function bagcheckCompleteMessage(name = 'Chiwawita'): string {
  return withName(pick(BAGCHECK_COMPLETE_MESSAGES_RAW), name);
}

const FOCUS_SESSION_DONE_MESSAGES_RAW = [
  '¡Sesión de enfoque completa! Te acompañé todo el rato 🐾',
  '¡Lo lograste, {name}! Un ratito de calma también cuenta.',
];

export function focusSessionDoneMessage(name = 'Chiwawita'): string {
  return withName(pick(FOCUS_SESSION_DONE_MESSAGES_RAW), name);
}

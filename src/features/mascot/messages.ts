import type { MascotMood } from './moodEngine';

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function withName(text: string, name: string): string {
  return text.replace('{name}', name);
}

const MOOD_MESSAGES: Record<MascotMood, string[]> = {
  feliz: [
    'ahí vas, {name}, sabía que podías 🐾',
    'me pones re contento cuando haces esto, en serio',
    'eso eso eso. sigue así porfa',
    'orgulloso de ti, no tienes idea cuánto',
    'jaja te está saliendo bien el día, ¿no? 💛',
  ],
  neutral: [
    'aquí ando, sin apurarte',
    'cuando quieras arrancamos con algo chiquito, sin drama',
    'todo tranqui por acá, {name}',
    'tú marcas el ritmo, yo nomás te sigo',
    'sin apuro. en serio, sin apuro',
  ],
  preocupado: [
    '¿empezamos con algo bien chiquitito? tú puedes',
    'no pasa nada si vas lento hoy, solo no te me pierdas',
    '¿un empujoncito? para eso estoy aquí, {name}',
    'oe, ¿aunque sea una cosita? la que sea',
  ],
  triste: [
    'te extrañé hoy, {name}... ¿mañana vemos algo juntos? 💛',
    'tranqui, mañana empezamos de nuevo. yo sigo aquí',
    'un día flojo no borra todo lo demás que sí hiciste, ¿ya?',
    'no te voy a dejar de querer por un día malo, jamás',
  ],
};

export function moodMessage(mood: MascotMood, name = 'Chiwawita'): string {
  return withName(pick(MOOD_MESSAGES[mood]), name);
}

export const TASK_DONE_MESSAGES = [
  'listo, un chiwawapunto más para ti 🐾',
  'uno menos, vamos bien',
  'así se hace',
  'eso cuenta, y cuenta harto',
  'ya po, mira cómo avanzas',
];

export const BIG_TASK_DONE_MESSAGES = [
  'esa era grande y la hiciste igual, estoy que exploto de orgullo 🐶',
  'lo lograste. esa no era fácil, lo sé',
  'eso merece más que un aplauso, casi lloro',
  'guau. en serio, guau',
];

export const STREAK_MILESTONE_MESSAGES: Record<number, string> = {
  3: '3 días seguidos, ya somos equipo 🔥',
  7: 'una semana entera. impresionante, de verdad',
  14: 'dos semanas. ya no te libras de mí 🐾',
  30: 'un mes. esto ya es costumbre bonita 💛',
  60: '60 días. wow, de verdad wow',
  100: '100 días. eres una máquina y yo tu fan número uno 🐶',
};

const BAGCHECK_COMPLETE_MESSAGES_RAW = [
  '¿segura que tienes tus llaves, {name}? el otro Perrito también te espera 🔑',
  'listo, ve con cuidado. te quiero',
  'bolso completo. ahora sí, a conquistar el día',
  'chequeado todo. ya puedes salir tranqui',
];

export function bagcheckCompleteMessage(name = 'Chiwawita'): string {
  return withName(pick(BAGCHECK_COMPLETE_MESSAGES_RAW), name);
}

const FOCUS_SESSION_DONE_MESSAGES_RAW = [
  'sesión completa, te acompañé todo el rato 🐾',
  'lo lograste, {name}. un ratito de calma también cuenta',
  'ya está, puedes soltar el aire',
];

export function focusSessionDoneMessage(name = 'Chiwawita'): string {
  return withName(pick(FOCUS_SESSION_DONE_MESSAGES_RAW), name);
}

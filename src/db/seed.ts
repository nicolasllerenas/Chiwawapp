import { nanoid } from 'nanoid';
import { db } from './db';

const DEFAULT_BAG_ITEMS = [
  { label: 'Llaves (Perrito)', emoji: '🔑' },
  { label: 'Botella de agua', emoji: '💧' },
  { label: 'Tablet', emoji: '📱' },
  { label: 'Zanahoria (lápiz de la tablet)', emoji: '🥕' },
  { label: 'Audífonos', emoji: '🎧' },
  { label: 'Cargador', emoji: '🔌' },
  { label: 'Laptop', emoji: '💻' },
];

const DEFAULT_REWARDS: {
  title: string;
  category: 'comida' | 'salidas' | 'maquillaje' | 'ropa' | 'otro';
  costPoints: number;
  approxSoles: number;
  emoji: string;
}[] = [
  { title: 'Broster / antojito', category: 'comida', costPoints: 150, approxSoles: 20, emoji: '🍗' },
  { title: 'Postre o snack especial', category: 'comida', costPoints: 100, approxSoles: 15, emoji: '🍰' },
  { title: 'Volt a algún lado', category: 'salidas', costPoints: 200, approxSoles: 18, emoji: '🚗' },
  { title: 'Cine o salida ligera', category: 'salidas', costPoints: 350, approxSoles: 35, emoji: '🎬' },
  { title: 'Maquillaje en Aruma', category: 'maquillaje', costPoints: 650, approxSoles: 70, emoji: '💄' },
  { title: 'Prenda en Gamarra', category: 'ropa', costPoints: 600, approxSoles: 60, emoji: '👗' },
  { title: 'Día especial de shopping', category: 'otro', costPoints: 1500, approxSoles: 180, emoji: '🛍️' },
];

export async function seedIfNeeded() {
  const settings = await db.settings.get('singleton');
  if (settings) return;

  await db.transaction('rw', db.settings, db.bagCheckItems, db.rewards, async () => {
    await db.settings.put({
      id: 'singleton',
      mascotName: 'Chiwi',
      userName: 'Chiwawita',
      onboardingComplete: false,
    });

    await db.bagCheckItems.bulkAdd(
      DEFAULT_BAG_ITEMS.map((item, i) => ({
        id: nanoid(),
        label: item.label,
        emoji: item.emoji,
        isDefault: true,
        checked: false,
        order: i,
      })),
    );

    await db.rewards.bulkAdd(
      DEFAULT_REWARDS.map((r) => ({
        id: nanoid(),
        title: r.title,
        category: r.category,
        costPoints: r.costPoints,
        approxSoles: r.approxSoles,
        active: true,
        emoji: r.emoji,
      })),
    );
  });
}

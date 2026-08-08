import { nanoid } from 'nanoid';
import { db } from '../../db/db';

export async function addBagItem(label: string, emoji = '✨') {
  const trimmed = label.trim();
  if (!trimmed) return;
  const count = await db.bagCheckItems.count();
  await db.bagCheckItems.add({
    id: nanoid(),
    label: trimmed,
    emoji,
    isDefault: false,
    checked: false,
    order: count,
  });
}

export async function toggleBagItem(id: string, checked: boolean) {
  await db.bagCheckItems.update(id, { checked });
}

export async function deleteBagItem(id: string) {
  await db.bagCheckItems.delete(id);
}

export async function resetBagChecklist() {
  const items = await db.bagCheckItems.toArray();
  await db.bagCheckItems.bulkPut(items.map((i) => ({ ...i, checked: false })));
}

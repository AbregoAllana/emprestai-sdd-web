import type { Equipment } from './equipment'
import { createLoan, getEquipment, listMyOpenLoans, type CatalogEquipment } from './generated/emprestai'

export type { OpenLoan } from './generated/emprestai'

const categoryLabels: Record<CatalogEquipment['category'], string> = {
  NOTEBOOK: 'Notebook',
  MONITOR: 'Monitor',
  CABLE: 'Cabo',
  CAMERA: 'Câmera',
  ACCESSORY: 'Acessório',
}

export async function listEquipment(): Promise<Equipment[]> {
  return (await getEquipment()).map((item) => ({
    id: item.id,
    category: categoryLabels[item.category],
    name: item.name,
    assetTag: item.assetTag ?? '—',
    status: item.condition === 'MAINTENANCE' ? 'manutencao' : item.borrowed ? 'emprestado' : 'disponivel',
    imageUrl: item.imageUrl ?? undefined,
    note: item.notes ?? 'Item em manutenção',
  }))
}

export const borrowEquipment = createLoan
export const listMyLoans = listMyOpenLoans

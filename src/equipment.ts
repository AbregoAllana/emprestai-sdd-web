export type EquipmentStatus = 'disponivel' | 'emprestado' | 'manutencao'
export type Filter = 'Todos' | 'Disponíveis' | 'Emprestados' | 'Em manutenção'

export type Equipment = {
  id: string
  category: string
  name: string
  assetTag: string
  status: EquipmentStatus
  imageUrl?: string
  note?: string
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(new Date(date))
}

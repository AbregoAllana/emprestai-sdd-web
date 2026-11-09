export type EquipmentStatus = 'disponivel' | 'emprestado' | 'manutencao'
export type Filter = 'Todos' | 'Disponíveis' | 'Emprestados' | 'Em manutenção'

export type Equipment = {
  id: string
  category: string
  name: string
  assetTag: string
  status: EquipmentStatus
  loanedTo?: string
  dueDate?: string
  note?: string
}

export const equipment: Equipment[] = [
  { id: 'notebook-dell', category: 'Notebook', name: 'Notebook Dell Latitude 5450', assetTag: 'TI-0142', status: 'disponivel' },
  { id: 'macbook-pro', category: 'Notebook', name: 'MacBook Pro 14 M3', assetTag: 'TI-0088', status: 'emprestado', loanedTo: 'Marcos Lemos', dueDate: '07/09/2026' },
  { id: 'monitor-lg', category: 'Monitor', name: 'Monitor LG 27" 4K', assetTag: 'TI-0231', status: 'disponivel' },
  { id: 'monitor-dell', category: 'Monitor', name: 'Monitor Dell 24" FHD', assetTag: 'TI-0233', status: 'manutencao', note: 'Painel com falha, retorna em 05/09' },
  { id: 'camera-sony', category: 'Câmera', name: 'Câmera Sony ZV-1', assetTag: 'TI-0301', status: 'emprestado', loanedTo: 'Ana Ribeiro', dueDate: '12/09/2026' },
  { id: 'cabo-hdmi', category: 'Cabo', name: 'Cabo HDMI 2.1 3m', assetTag: 'TI-0455', status: 'disponivel' },
  { id: 'dock-thunderbolt', category: 'Acessório', name: 'Dock Thunderbolt 4', assetTag: 'TI-0512', status: 'emprestado', loanedTo: 'Ana Ribeiro', dueDate: '05/09/2026' },
  { id: 'tripé-manfrotto', category: 'Acessório', name: 'Tripé Manfrotto Befree', assetTag: 'TI-0318', status: 'manutencao', note: 'Trava do centro quebrada' },
  { id: 'headset-jabra', category: 'Acessório', name: 'Headset Jabra Evolve2', assetTag: 'TI-0402', status: 'disponivel' },
]
export interface Category {
  id: number;
  name: string;
  groupType?: string | null;
  icon?: string | null;
  isDefault: boolean;
  sortOrder: number;
} 
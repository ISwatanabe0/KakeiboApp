// アイドルグループ型定義
export interface Group {
  id: number;
  name: string;
  groupType: 'サカミチ' | 'AKB' | 'ハロプロ' | 'K-POP' | '地下' | 'VTuber' | 'その他';
  color: string;
  emoji?: string;
  debutDate?: string;
  isActive: boolean;
  createdAt: string;
}

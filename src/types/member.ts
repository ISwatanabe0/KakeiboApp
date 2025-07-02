// メンバー型定義
export interface Member {
  id: number;
  groupId: number;
  name: string;
  memberColor?: string;
  position?: string;
  joinDate?: string;
  graduationDate?: string;
  oshiLevel: 0 | 1 | 2 | 3; // その他・好き・推し・最推し
  oshiSince?: string;
  createdAt: string;
}

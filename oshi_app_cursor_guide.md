# 推し活家計簿アプリ - Cursor開発指示書（アイドル特化版）

## プロジェクト概要
アイドル推し活に特化した家計簿アプリ。グループ・メンバー階層管理により複数推し対応、推しレベル別支出管理、アイドル業界特有のカテゴリ・分析機能を持つPWAアプリケーション。

## 技術スタック
- **フロントエンド**: React 18 + TypeScript + Vite
- **スタイリング**: TailwindCSS
- **データベース**: SQLite (sql.js)
- **状態管理**: Zustand
- **PWA**: Workbox (Vite Plugin)
- **グラフ**: Chart.js または Recharts
- **アイコン**: Lucide React

## プロジェクト構造
```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── common/         # 汎用コンポーネント (Button, Modal等)
│   ├── group/          # グループ管理関連
│   ├── member/         # メンバー管理関連
│   ├── expense/        # 支出記録関連
│   └── dashboard/      # ダッシュボード関連
├── pages/              # ページコンポーネント
├── store/              # Zustand状態管理
├── db/                 # SQLiteスキーマ・操作
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
└── assets/             # 静的ファイル
```

## データベース設計

### テーブル構造
```sql
-- アイドルグループ
CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  group_type TEXT NOT NULL,    -- 坂道/AKB/K-POP/地下/VTuber等
  color TEXT NOT NULL,         -- グループカラー(HEX)
  emoji TEXT,                  -- グループ絵文字(最大2文字)
  debut_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- メンバー
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  member_color TEXT,           -- メンバーカラー(HEX)
  position TEXT,               -- センター/フロント等
  join_date DATE,              -- 加入日
  graduation_date DATE,        -- 卒業日
  oshi_level INTEGER DEFAULT 0, -- 0:その他 1:好き 2:推し 3:最推し
  oshi_since DATE,             -- 推し始めた日
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- 支出カテゴリ
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  group_type TEXT,             -- 特定グループタイプ専用(NULL=共通)
  icon TEXT,                   -- Lucide Reactアイコン名
  is_default BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- 支出記録
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,     -- 円単位
  date DATE NOT NULL,
  event_name TEXT,             -- イベント名
  venue TEXT,                  -- 会場
  quantity INTEGER DEFAULT 1,  -- 購入数量(CD枚数等)
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 支出とメンバーの関連(複数推し対応)
CREATE TABLE expense_members (
  expense_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  ratio REAL DEFAULT 1.0,      -- 支出配分比率
  PRIMARY KEY (expense_id, member_id),
  FOREIGN KEY (expense_id) REFERENCES expenses(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- 月次予算
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  member_id INTEGER,           -- NULL=グループ全体予算
  year_month TEXT NOT NULL,    -- YYYY-MM形式
  amount INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (member_id) REFERENCES members(id),
  UNIQUE(group_id, member_id, year_month)
);
```

### 初期データ（カテゴリ）
```sql
-- 共通カテゴリ
INSERT INTO categories (name, icon, sort_order) VALUES
('ライブチケット', 'Ticket', 10),
('グッズ', 'ShoppingBag', 20),
('CD・音源', 'Disc', 30),
('配信・投げ銭', 'Smartphone', 40),
('交通費', 'Train', 50),
('宿泊費', 'Bed', 60),
('食事・カフェ', 'Coffee', 70),
('その他', 'MoreHorizontal', 999);

-- メジャー系専用
INSERT INTO categories (name, group_type, icon, sort_order) VALUES
('握手会', '坂道', 'Hand', 15),
('握手会', 'AKB', 'Hand', 15),
('特典会', '坂道', 'Gift', 16),
('お見送り会', 'AKB', 'Heart', 17);

-- K-POP専用
INSERT INTO categories (name, group_type, icon, sort_order) VALUES
('ファンミーティング', 'K-POP', 'Users', 15),
('サイン会', 'K-POP', 'PenTool', 16),
('ハイタッチ会', 'K-POP', 'Hand', 17);

-- 地下アイドル専用
INSERT INTO categories (name, group_type, icon, sort_order) VALUES
('チェキ会', '地下', 'Camera', 15),
('物販', '地下', 'Store', 16),
('クラウドファンディング', '地下', 'DollarSign', 18);
```

## 機能要件詳細

### A. グループ・メンバー管理機能
- **グループ管理**: CRUD操作、グループタイプ選択、カラー・絵文字設定
- **メンバー管理**: CRUD操作、推しレベル設定、推し開始日記録
- **推しレベル**: 最推し(3) > 推し(2) > 好き(1) > その他(0)
- **卒業対応**: 卒業日設定、卒業メンバーの履歴保持

### B. 支出記録機能
- **段階的入力**: グループ選択 → メンバー選択 → カテゴリ・金額入力
- **複数メンバー対応**: チェックボックス選択、自動配分計算
- **クイック入力**: よく使う組み合わせのテンプレート
- **詳細情報**: イベント名、会場、数量、メモ

### C. 履歴・検索機能
- **多軸フィルタ**: グループ・メンバー・カテゴリ・期間・推しレベル
- **ソート**: 日付・金額・グループ・カテゴリ
- **編集・削除**: 一括操作対応
- **エクスポート**: CSV出力

### D. ダッシュボード・分析機能
- **支出サマリー**: 今月・先月・年間の推しレベル別集計
- **グループ分析**: グループ別支出比率・推移
- **推し分析**: メンバー別支出・推し格差・推し変遷
- **カテゴリ分析**: アイドル活動別支出内訳
- **現場分析**: 参戦回数・遠征費・接触回数

## 画面設計

### 画面一覧
1. **ホーム画面** (`/`) - 全体ダッシュボード
2. **支出記録画面** (`/add`) - 段階的入力フォーム
3. **履歴画面** (`/history`) - 支出履歴・検索・編集
4. **グループ管理画面** (`/groups`) - グループ・メンバー管理
5. **分析画面** (`/analytics`) - 詳細分析・グラフ
6. **設定画面** (`/settings`) - アプリ設定・カテゴリ管理

### 画面仕様詳細

#### ホーム画面
- **今月支出サマリー**: グループ別・推しレベル別
- **推し一覧**: 最推し・推しメンバーのカード表示
- **最近の支出**: 直近5件のクイック表示
- **クイックアクション**: よく使う記録パターン

#### 支出記録画面
- **Step1**: グループ選択（カラー・絵文字表示）
- **Step2**: メンバー選択（推しレベル表示、複数選択可）
- **Step3**: カテゴリ選択（グループタイプ別表示）
- **Step4**: 金額・詳細入力

#### グループ管理画面
- **グループ一覧**: アクティブ・非アクティブ切替
- **メンバー管理**: 推しレベル編集、並び順変更
- **推し設定**: 推し開始日、推し変遷履歴

### レスポンシブ対応
- **モバイルファースト**: 縦持ち最適化
- **タブレット対応**: 横並び表示、グリッド表示
- **タッチ操作**: 最小44px、スワイプ操作
- **ブレークポイント**: sm(640px), md(768px), lg(1024px)

## UI/UXガイドライン

### デザインシステム
- **カラー**: グループカラー + 推しレベル別カラー + ベースカラー
- **推しレベル色**: 最推し(ピンク) > 推し(紫) > 好き(青) > その他(グレー)
- **フォント**: Noto Sans JP（絵文字対応）
- **角丸**: rounded-lg統一
- **アニメーション**: 推しカラーグラデーション、カード展開

### アイドル特化UI
- **推しカラー適用**: ボタン・アクセント・グラフ
- **絵文字表示**: グループ・メンバー識別
- **推しレベル表示**: バッジ・ボーダー・アイコン
- **卒業メンバー**: グレーアウト表示

## 開発フェーズ

### Phase 1: 基本機能（MVP）
1. プロジェクト初期設定・DB設計
2. グループ・メンバー管理機能
3. 基本的な支出記録（単一メンバー）
4. シンプルな履歴表示

### Phase 2: 推し活特化機能
1. 複数メンバー支出記録
2. 推しレベル管理
3. カテゴリ細分化
4. 基本的なダッシュボード

### Phase 3: 分析・可視化
1. グラフ・チャート実装
2. 多軸分析機能
3. フィルタ・検索強化
4. エクスポート機能

### Phase 4: PWA・拡張機能
1. Service Worker・オフライン対応
2. インストール対応
3. バックアップ・復元
4. 高度な分析機能

## TypeScript型定義

```typescript
// 基本型
interface Group {
  id: number;
  name: string;
  groupType: 'サカミチ' | 'AKB' | 'ハロプロ' | 'K-POP' | '地下' | 'VTuber' | 'その他';
  color: string;
  emoji?: string;
  debutDate?: string;
  isActive: boolean;
  createdAt: string;
}

interface Member {
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

interface Expense {
  id: number;
  groupId: number;
  categoryId: number;
  amount: number;
  date: string;
  eventName?: string;
  venue?: string;
  quantity: number;
  memo?: string;
  members: ExpenseMember[];
  createdAt: string;
}

interface ExpenseMember {
  memberId: number;
  ratio: number;
}

// 分析用型
interface ExpenseAnalytics {
  totalAmount: number;
  groupBreakdown: GroupExpense[];
  memberBreakdown: MemberExpense[];
  categoryBreakdown: CategoryExpense[];
  monthlyTrend: MonthlyExpense[];
}
```

## Cursor使用時の指示テンプレート

### 初期設定時
```
推し活家計簿アプリ（アイドル特化）のReact + TypeScript + Viteプロジェクトを作成してください。
- グループ・メンバー階層管理
- 複数推し対応
- sql.js、Zustand、TailwindCSS、Chart.js、Lucide Reactを含める
- PWA対応のVite設定
- 上記のDB設計とフォルダ構造で作成
```

### コンポーネント作成時
```
[機能名]の[コンポーネント名]を作成してください。
- 複数推し対応（推しレベル表示）
- グループカラーの動的適用
- アイドル業界用語に対応
- モバイルファーストのレスポンシブ
- TypeScriptで型安全に実装
```

### データベース操作時
```
sql.jsでグループ・メンバー・支出の[操作名]を実装してください。
- 複数メンバー関連の正規化対応
- 推しレベル・卒業状態考慮
- エラーハンドリング・トランザクション対応
- TypeScript型定義も併せて作成
```

### 分析機能実装時
```
[分析機能名]を実装してください。
- グループ・メンバー・推しレベル別集計
- Chart.jsでアイドル推し活らしいグラフ表示
- グループカラー・推しレベル色を反映
- モバイル対応のレスポンシブグラフ
```

## 注意事項
- **金額**: Integer（円単位）で保存
- **日付**: YYYY-MM-DD形式統一
- **色**: HEX形式（#RRGGBB）で保存
- **推しレベル**: 0-3の数値、UI表示時は文字列変換
- **複数メンバー支出**: 必ず比率の合計が1.0になるよう検証
- **卒業メンバー**: 論理削除（graduation_date設定）
- **PWA**: 全外部リソースローカル化、オフライン完全対応
- **バックアップ**: sql.jsファイルの定期的なlocalStorage保存

## デバッグ・テスト
- **DB確認**: SQLiteブラウザでスキーマ・データ確認
- **推し活シナリオ**: 複数グループ・複数推しでのテストデータ作成
- **PWA監査**: Lighthouse PWA监査実行
- **実機テスト**: iOS/Android実機でタッチ操作確認
- **データ整合性**: 複数メンバー支出の比率計算検証
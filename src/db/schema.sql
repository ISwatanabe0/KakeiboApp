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
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER,
  member_id INTEGER,
  amount INTEGER,
  category TEXT,
  date TEXT,
  memo TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
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

-- 初期データ（カテゴリ）
INSERT INTO categories (name, icon, sort_order) VALUES
('ライブチケット', 'Ticket', 10),
('グッズ', 'ShoppingBag', 20),
('CD・音源', 'Disc', 30),
('配信・投げ銭', 'Smartphone', 40),
('交通費', 'Train', 50),
('宿泊費', 'Bed', 60),
('食事・カフェ', 'Coffee', 70),
('その他', 'MoreHorizontal', 999);

INSERT INTO categories (name, group_type, icon, sort_order) VALUES
('握手会', '坂道', 'Hand', 15),
('握手会', 'AKB', 'Hand', 15),
('特典会', '坂道', 'Gift', 16),
('お見送り会', 'AKB', 'Heart', 17),
('ファンミーティング', 'K-POP', 'Users', 15),
('サイン会', 'K-POP', 'PenTool', 16),
('ハイタッチ会', 'K-POP', 'Hand', 17),
('チェキ会', '地下', 'Camera', 15),
('物販', '地下', 'Store', 16),
('クラウドファンディング', '地下', 'DollarSign', 18);

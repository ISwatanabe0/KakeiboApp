// db.ts: sql.jsによるDB初期化ロジック雛形
// @ts-ignore
import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic } from 'sql.js';
import { Group } from '../types';
import { Expense } from '../types/expense';
import { Member } from '../types/member';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

// schema.sqlをimport（Viteのraw import機能を利用）
// @ts-ignore
import schemaSql from './schema.sql?raw';

/**
 * DBを初期化し、グローバルで使えるDatabaseインスタンスを返す
 */
export async function getDb(): Promise<Database> {
  if (db) return db;
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `/sql-wasm.wasm`
    });
  }
  db = new SQL.Database();
  // スキーマ・初期データを流し込む
  db.run(schemaSql);
  return db;
}

// 例: クエリ実行関数
export async function execQuery(sql: string, params: any[] = []): Promise<any> {
  const database = await getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const result: any[] = [];
  while (stmt.step()) {
    result.push(stmt.getAsObject());
  }
  stmt.free();
  return result;
}

// グループ一覧取得
export async function getAllGroups(): Promise<Group[]> {
  const db = await getDb();
  const res = db.exec('SELECT * FROM groups ORDER BY id ASC');
  if (!res[0]) return [];
  return res[0].values.map((row: any[]) => ({
    id: row[0],
    name: row[1],
    groupType: row[2],
    color: row[3],
    emoji: row[4],
    debutDate: row[5],
    isActive: !!row[6],
    createdAt: row[7],
  }));
}

// グループ追加
export async function addGroup(group: Omit<Group, 'id' | 'createdAt'>): Promise<void> {
  const db = await getDb();
  db.run(
    'INSERT INTO groups (name, group_type, color, emoji, debut_date, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [group.name, group.groupType, group.color, group.emoji, group.debutDate, group.isActive ? 1 : 0]
  );
}

// グループ削除
export async function deleteGroup(id: number): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM groups WHERE id = ?', [id]);
}

// 支出一覧取得
export async function getAllExpenses(): Promise<Expense[]> {
  const db = await getDb();
  const res = db.exec('SELECT * FROM expenses ORDER BY date DESC, id DESC');
  if (!res[0]) return [];
  return res[0].values.map((row: any[]) => ({
    id: row[0],
    group_id: row[1],
    member_id: row[2],
    amount: row[3],
    category: row[4],
    date: row[5],
    memo: row[6],
    created_at: row[7],
  }));
}

// 支出追加
export async function addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<void> {
  const db = await getDb();
  db.run(
    'INSERT INTO expenses (group_id, member_id, amount, category, date, memo) VALUES (?, ?, ?, ?, ?, ?)',
    [expense.group_id, expense.member_id, expense.amount, expense.category, expense.date, expense.memo]
  );
}

// 支出削除
export async function deleteExpense(id: number): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM expenses WHERE id = ?', [id]);
}

// メンバー一覧取得
export async function getAllMembers(): Promise<Member[]> {
  const db = await getDb();
  const res = db.exec('SELECT * FROM members ORDER BY id ASC');
  if (!res[0]) return [];
  return res[0].values.map((row: any[]) => ({
    id: row[0],
    groupId: row[1],
    name: row[2],
    memberColor: row[3],
    position: row[4],
    joinDate: row[5],
    graduationDate: row[6],
    oshiLevel: row[7],
    oshiSince: row[8],
    createdAt: row[9],
  }));
}

// メンバー追加
export async function addMember(member: Omit<Member, 'id' | 'createdAt'>): Promise<void> {
  const db = await getDb();
  db.run(
    'INSERT INTO members (group_id, name, member_color, position, join_date, graduation_date, oshi_level, oshi_since) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      member.groupId,
      member.name,
      member.memberColor || null,
      member.position || null,
      member.joinDate || null,
      member.graduationDate || null,
      member.oshiLevel,
      member.oshiSince || null,
    ]
  );
}

// メンバー編集
export async function updateMember(member: Member): Promise<void> {
  const db = await getDb();
  db.run(
    'UPDATE members SET group_id = ?, name = ?, member_color = ?, position = ?, join_date = ?, graduation_date = ?, oshi_level = ?, oshi_since = ? WHERE id = ?',
    [
      member.groupId,
      member.name,
      member.memberColor || null,
      member.position || null,
      member.joinDate || null,
      member.graduationDate || null,
      member.oshiLevel,
      member.oshiSince || null,
      member.id,
    ]
  );
}

// メンバー削除
export async function deleteMember(id: number): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM members WHERE id = ?', [id]);
}

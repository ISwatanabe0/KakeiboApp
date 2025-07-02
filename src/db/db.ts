// db.ts: sql.jsによるDB初期化ロジック雛形
// @ts-ignore
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

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
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
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

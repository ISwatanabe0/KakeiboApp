// 支出記録・分析用型定義
export interface Expense {
  id: number;
  group_id: number | null;
  member_id: number | null;
  amount: number;
  category: string;
  date: string;
  memo: string | null;
  created_at: string;
}

export interface ExpenseMember {
  memberId: number;
  ratio: number;
}

// 分析用型（詳細は必要に応じて拡張）
export interface ExpenseAnalytics {
  totalAmount: number;
  groupBreakdown: GroupExpense[];
  memberBreakdown: MemberExpense[];
  categoryBreakdown: CategoryExpense[];
  monthlyTrend: MonthlyExpense[];
}

// サンプル型（詳細は後で定義）
export interface GroupExpense { groupId: number; amount: number; }
export interface MemberExpense { memberId: number; amount: number; }
export interface CategoryExpense { categoryId: number; amount: number; }
export interface MonthlyExpense { yearMonth: string; amount: number; }

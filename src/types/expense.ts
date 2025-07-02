// 支出記録・分析用型定義
export interface Expense {
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

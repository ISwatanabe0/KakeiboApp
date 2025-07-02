import React, { useEffect, useState } from 'react';
import { useExpenseStore } from '../store/expenseStore';

const initialForm = {
  date: '',
  amount: '',
  category: '',
  memo: '',
};

const History: React.FC = () => {
  const { expenses, fetchExpenses, loading, add, remove } = useExpenseStore();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category) {
      setError('日付・金額・カテゴリは必須です');
      return;
    }
    setError('');
    await add({
      group_id: null,
      member_id: null,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      memo: form.memo || null,
    });
    setForm(initialForm);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">支出履歴</h2>
      <form className="mb-4 flex flex-wrap gap-2 items-end" onSubmit={handleAdd}>
        <div>
          <label className="block text-xs">日付</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="border px-2 py-1" />
        </div>
        <div>
          <label className="block text-xs">金額</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border px-2 py-1 w-20" />
        </div>
        <div>
          <label className="block text-xs">カテゴリ</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} className="border px-2 py-1 w-24" />
        </div>
        <div>
          <label className="block text-xs">メモ</label>
          <input type="text" name="memo" value={form.memo} onChange={handleChange} className="border px-2 py-1 w-32" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">追加</button>
        {error && <span className="text-red-500 ml-2 text-xs">{error}</span>}
      </form>
      {/* 多軸フィルタ（グループ・メンバー・カテゴリ・期間・推しレベル） */}
      {/* ソート（日時・金額・グループ・カテゴリ） */}
      {/* 履歴リスト表示 */}
      {/* 編集・削除・一括操作 */}
      {/* CSVエクスポートボタン */}
      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">日付</th>
              <th className="border px-2">金額</th>
              <th className="border px-2">カテゴリ</th>
              <th className="border px-2">メモ</th>
              <th className="border px-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="border px-2">{e.date}</td>
                <td className="border px-2">{e.amount}</td>
                <td className="border px-2">{e.category}</td>
                <td className="border px-2">{e.memo}</td>
                <td className="border px-2">
                  <button onClick={() => handleDelete(e.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;

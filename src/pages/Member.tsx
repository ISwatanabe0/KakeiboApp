import React, { useEffect, useState } from 'react';
import { useMemberStore } from '../store/memberStore';

const initialForm = {
  groupId: '',
  name: '',
  memberColor: '',
  position: '',
  joinDate: '',
  graduationDate: '',
  oshiLevel: 0,
  oshiSince: '',
};

const MemberPage: React.FC = () => {
  const { members, fetchMembers, loading, add, update, remove } = useMemberStore();
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.groupId || !form.name) {
      setError('グループIDと名前は必須です');
      return;
    }
    setError('');
    await add({
      groupId: Number(form.groupId),
      name: form.name,
      memberColor: form.memberColor || undefined,
      position: form.position || undefined,
      joinDate: form.joinDate || undefined,
      graduationDate: form.graduationDate || undefined,
      oshiLevel: Number(form.oshiLevel) as 0 | 1 | 2 | 3,
      oshiSince: form.oshiSince || undefined,
    });
    setForm(initialForm);
  };

  const handleEdit = (member: any) => {
    setEditId(member.id);
    setForm({
      groupId: String(member.groupId),
      name: member.name,
      memberColor: member.memberColor || '',
      position: member.position || '',
      joinDate: member.joinDate || '',
      graduationDate: member.graduationDate || '',
      oshiLevel: member.oshiLevel,
      oshiSince: member.oshiSince || '',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    await update({
      id: editId,
      groupId: Number(form.groupId),
      name: form.name,
      memberColor: form.memberColor || undefined,
      position: form.position || undefined,
      joinDate: form.joinDate || undefined,
      graduationDate: form.graduationDate || undefined,
      oshiLevel: Number(form.oshiLevel) as 0 | 1 | 2 | 3,
      oshiSince: form.oshiSince || undefined,
      createdAt: '', // DB側で自動生成
    });
    setEditId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    if (editId === id) {
      setEditId(null);
      setForm(initialForm);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">メンバー管理</h2>
      <form className="mb-4 flex flex-wrap gap-2 items-end" onSubmit={editId === null ? handleAdd : handleUpdate}>
        <div>
          <label className="block text-xs">グループID</label>
          <input type="number" name="groupId" value={form.groupId} onChange={handleChange} className="border px-2 py-1 w-16" />
        </div>
        <div>
          <label className="block text-xs">名前</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="border px-2 py-1 w-24" />
        </div>
        <div>
          <label className="block text-xs">カラー</label>
          <input type="text" name="memberColor" value={form.memberColor} onChange={handleChange} className="border px-2 py-1 w-20" />
        </div>
        <div>
          <label className="block text-xs">役割</label>
          <input type="text" name="position" value={form.position} onChange={handleChange} className="border px-2 py-1 w-20" />
        </div>
        <div>
          <label className="block text-xs">加入日</label>
          <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} className="border px-2 py-1 w-28" />
        </div>
        <div>
          <label className="block text-xs">卒業日</label>
          <input type="date" name="graduationDate" value={form.graduationDate} onChange={handleChange} className="border px-2 py-1 w-28" />
        </div>
        <div>
          <label className="block text-xs">推しレベル</label>
          <select name="oshiLevel" value={form.oshiLevel} onChange={handleChange} className="border px-2 py-1 w-16">
            <option value={0}>その他</option>
            <option value={1}>好き</option>
            <option value={2}>推し</option>
            <option value={3}>最推し</option>
          </select>
        </div>
        <div>
          <label className="block text-xs">推し始めた日</label>
          <input type="date" name="oshiSince" value={form.oshiSince} onChange={handleChange} className="border px-2 py-1 w-28" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">{editId === null ? '追加' : '更新'}</button>
        {editId !== null && (
          <button type="button" onClick={() => { setEditId(null); setForm(initialForm); }} className="bg-gray-400 text-white px-3 py-1 rounded ml-2">キャンセル</button>
        )}
        {error && <span className="text-red-500 ml-2 text-xs">{error}</span>}
      </form>
      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">ID</th>
              <th className="border px-2">グループID</th>
              <th className="border px-2">名前</th>
              <th className="border px-2">カラー</th>
              <th className="border px-2">役割</th>
              <th className="border px-2">加入日</th>
              <th className="border px-2">卒業日</th>
              <th className="border px-2">推しレベル</th>
              <th className="border px-2">推し始めた日</th>
              <th className="border px-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="border px-2">{m.id}</td>
                <td className="border px-2">{m.groupId}</td>
                <td className="border px-2">{m.name}</td>
                <td className="border px-2">{m.memberColor}</td>
                <td className="border px-2">{m.position}</td>
                <td className="border px-2">{m.joinDate}</td>
                <td className="border px-2">{m.graduationDate}</td>
                <td className="border px-2">{['その他','好き','推し','最推し'][m.oshiLevel]}</td>
                <td className="border px-2">{m.oshiSince}</td>
                <td className="border px-2">
                  <button onClick={() => handleEdit(m)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-1">編集</button>
                  <button onClick={() => handleDelete(m.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberPage; 
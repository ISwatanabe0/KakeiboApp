import React, { useEffect, useState } from 'react';
import { LucideUsers, LucidePlusCircle, LucideEdit, LucideChevronRight } from 'lucide-react';
import { useGroupStore } from '../store/groupStore';
import Modal from '../components/common/Modal';
import { Group } from '../types';

const groupTypeOptions: { label: string; value: Group['groupType']; color: string; emoji: string }[] = [
  { label: 'サカミチ', value: 'サカミチ', color: 'from-pink-400 to-pink-600', emoji: '🌸' },
  { label: 'AKB', value: 'AKB', color: 'from-violet-400 to-violet-600', emoji: '🎤' },
  { label: 'K-POP', value: 'K-POP', color: 'from-blue-400 to-blue-600', emoji: '💎' },
  { label: 'VTuber', value: 'VTuber', color: 'from-green-400 to-green-600', emoji: '🦄' },
  { label: '地下', value: '地下', color: 'from-gray-400 to-gray-600', emoji: '🕶️' },
  { label: 'その他', value: 'その他', color: 'from-yellow-400 to-yellow-600', emoji: '⭐' },
  { label: 'ハロプロ', value: 'ハロプロ', color: 'from-pink-300 to-pink-500', emoji: '🍑' },
];

const Groups: React.FC = () => {
  const { groups, fetchGroups, addGroup } = useGroupStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    groupType: Group['groupType'];
    color: string;
    emoji: string;
    debutDate: string;
    isActive: boolean;
  }>({
    name: '',
    groupType: 'サカミチ',
    color: '#ec4899',
    emoji: '🌸',
    debutDate: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addGroup({ ...form });
    setLoading(false);
    setModalOpen(false);
    setForm({ name: '', groupType: 'サカミチ', color: '#ec4899', emoji: '🌸', debutDate: '', isActive: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-violet-50 pb-16">
      <section className="max-w-2xl mx-auto py-8 px-2">
        <h1 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent drop-shadow flex items-center justify-center gap-2">
          <LucideUsers size={28}/> グループ管理
        </h1>
        {/* 追加ボタン */}
        <div className="flex justify-end mb-4">
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-bold shadow hover:scale-105 transition">
            <LucidePlusCircle size={20}/> グループ追加
          </button>
        </div>
        {/* グループ一覧カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => {
            const typeInfo = groupTypeOptions.find(opt => opt.value === group.groupType) || groupTypeOptions[0];
            return (
              <div key={group.id} className={`rounded-xl p-4 shadow-lg bg-gradient-to-br ${typeInfo.color} text-white relative animate-fade-in flex flex-col gap-2`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{group.emoji || typeInfo.emoji}</span>
                  <span className="font-bold text-lg">{group.name}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white bg-opacity-20 border border-white/30">{group.groupType}</span>
                  {!group.isActive && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-300 text-gray-500">非アクティブ</span>}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <button className="flex items-center gap-1 text-white/80 hover:text-white font-semibold text-sm">
                    <LucideEdit size={16}/> 編集
                  </button>
                  <button className="flex items-center gap-1 text-white/80 hover:text-white font-semibold text-sm">
                    メンバー管理 <LucideChevronRight size={16}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* メンバー管理セクション（ダミー） */}
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-2 text-pink-600 flex items-center gap-2"><LucideUsers size={20}/>メンバー管理</h2>
          <div className="rounded-xl bg-white shadow p-4 text-gray-600 text-center opacity-70">
            グループを選択すると、ここにメンバー管理UIが表示されます。
          </div>
        </section>
      </section>
      {/* 追加モーダル */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="グループ追加">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">グループ名</label>
            <input required className="w-full px-3 py-2 rounded border" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">グループタイプ</label>
            <select className="w-full px-3 py-2 rounded border" value={form.groupType} onChange={e => {
              const type = e.target.value as Group['groupType'];
              const info = groupTypeOptions.find(opt => opt.value === type) || groupTypeOptions[0];
              setForm(f => ({ ...f, groupType: info.value as Group['groupType'], color: info.color, emoji: info.emoji }));
            }}>
              {groupTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">グループカラー</label>
            <input type="color" className="w-12 h-8 p-0 border rounded" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">絵文字</label>
            <input className="w-full px-3 py-2 rounded border" value={form.emoji} maxLength={2} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">デビュー日</label>
            <input type="date" className="w-full px-3 py-2 rounded border" value={form.debutDate} onChange={e => setForm(f => ({ ...f, debutDate: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} id="isActive" />
            <label htmlFor="isActive" className="text-sm">アクティブ</label>
          </div>
          <button type="submit" className="mt-2 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-bold shadow hover:scale-105 transition" disabled={loading}>
            {loading ? '追加中...' : '追加する'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;

import React from 'react';
// TODO: lucide-reactが見つからないため、アイコンのインポートを一時的にコメントアウト
import { LucideSparkles, LucideHeart, LucideUser, LucidePlusCircle } from 'lucide-react';

// ダミーデータ
const summary = [
  { label: '今月の支出', value: '¥12,000', color: 'from-pink-400 to-pink-600', icon: <LucideSparkles size={28} /> },
  { label: '推しグループ', value: '3', color: 'from-violet-400 to-violet-600', icon: <LucideUser size={28} /> },
  { label: '推しメンバー', value: '5', color: 'from-blue-400 to-blue-600', icon: <LucideHeart size={28} /> },
];
const oshiList = [
  { name: 'さくら', level: '最推し', color: 'bg-pink-400', emoji: '🌸' },
  { name: 'みく', level: '推し', color: 'bg-violet-400', emoji: '🎤' },
  { name: 'りん', level: '好き', color: 'bg-blue-400', emoji: '💎' },
];
const recentExpenses = [
  { event: 'ライブチケット', amount: 8000, date: '2024-07-01', group: 'さくら坂', color: 'text-pink-500' },
  { event: 'グッズ', amount: 2000, date: '2024-06-28', group: 'みく坂', color: 'text-violet-500' },
  { event: 'CD', amount: 2000, date: '2024-06-25', group: 'りん坂', color: 'text-blue-500' },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-violet-50 pb-16">
      {/* ヒーローセクション */}
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent drop-shadow">推し活家計簿アプリ</h1>
        <p className="mt-2 text-pink-600 font-semibold flex items-center justify-center gap-2">
          <LucideSparkles size={20} className="inline" /> アイドル推し活のための可愛い家計簿
        </p>
      </section>
      {/* サマリーカード */}
      <section className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8 px-2">
        {summary.map((item, i) => (
          <div key={i} className={`flex-1 rounded-xl p-4 shadow-lg bg-gradient-to-br ${item.color} text-white flex items-center gap-4 animate-fade-in`}>
            <div className="text-3xl">{item.icon}</div>
            <div>
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-sm opacity-80">{item.label}</div>
            </div>
          </div>
        ))}
      </section>
      {/* 推し一覧カード */}
      <section className="max-w-2xl mx-auto mb-8 px-2">
        <h2 className="text-xl font-bold mb-3 text-pink-600 flex items-center gap-2"><LucideHeart size={20}/>推し一覧</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {oshiList.map((oshi, i) => (
            <div key={i} className={`min-w-[120px] rounded-xl shadow-md p-4 flex flex-col items-center ${oshi.color} text-white relative animate-pop-in`}>
              <span className="text-3xl mb-1">{oshi.emoji}</span>
              <span className="font-bold text-lg">{oshi.name}</span>
              <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white bg-opacity-20 border border-white/30">{oshi.level}</span>
              {oshi.level === '最推し' && <span className="absolute top-2 right-2 text-pink-200 animate-bounce">★</span>}
            </div>
          ))}
        </div>
      </section>
      {/* 最近の支出リスト */}
      <section className="max-w-2xl mx-auto mb-8 px-2">
        <h2 className="text-xl font-bold mb-3 text-violet-600 flex items-center gap-2"><LucideUser size={20}/>最近の支出</h2>
        <ul className="divide-y divide-violet-100 bg-white rounded-xl shadow overflow-hidden">
          {recentExpenses.map((exp, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-semibold">{exp.event}</div>
                <div className="text-xs text-gray-400">{exp.date}・{exp.group}</div>
              </div>
              <div className={`font-bold text-lg ${exp.color}`}>¥{exp.amount.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
      {/* クイックアクション */}
      <section className="max-w-2xl mx-auto px-2">
        <h2 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2"><LucidePlusCircle size={20}/>クイックアクション</h2>
        <div className="flex gap-4">
          <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-violet-400 text-white font-bold shadow-lg hover:scale-105 transition text-lg flex items-center justify-center gap-2">
            <LucidePlusCircle size={24}/> 支出を記録
          </button>
          <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-400 to-blue-400 text-white font-bold shadow-lg hover:scale-105 transition text-lg flex items-center justify-center gap-2">
            <LucideSparkles size={24}/> 推しを追加
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;

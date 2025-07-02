import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="p-4">
      {/* 今月支出サマリー */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">今月の支出サマリー</h2>
        {/* グループ別・推しレベル別サマリー表示予定 */}
      </section>
      {/* 推し一覧 */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">推し一覧</h2>
        {/* 最推し・推しメンバーのカード表示予定 */}
      </section>
      {/* 最近の支出 */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">最近の支出</h2>
        {/* 直近5件のクイック表示予定 */}
      </section>
      {/* クイックアクション */}
      <section>
        <h2 className="text-xl font-bold mb-2">クイックアクション</h2>
        {/* よく使う記録パターン表示予定 */}
      </section>
    </div>
  );
};

export default Home;

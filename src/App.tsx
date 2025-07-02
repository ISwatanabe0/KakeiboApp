import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Add from './pages/Add';
import History from './pages/History';
import Groups from './pages/Groups';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="py-4 bg-white shadow">
          <h1 className="text-2xl font-bold text-center">推し活家計簿アプリ</h1>
          <nav className="flex justify-center gap-4 mt-2">
            <Link to="/" className="hover:underline">ホーム</Link>
            <Link to="/add" className="hover:underline">支出記録</Link>
            <Link to="/history" className="hover:underline">履歴</Link>
            <Link to="/groups" className="hover:underline">グループ管理</Link>
            <Link to="/analytics" className="hover:underline">分析</Link>
            <Link to="/settings" className="hover:underline">設定</Link>
          </nav>
        </header>
        <main className="max-w-2xl mx-auto py-8 px-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/history" element={<History />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 
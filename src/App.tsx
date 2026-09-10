import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { BoardView } from './components/BoardView';
import { IssueModal } from './components/IssueModal';
import './styles.css';

export const App: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('jira-theme-preference');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }
  }, []);

  return (
    <div className="app-layout">
      <Header />
      <BoardView />
      <IssueModal />
    </div>
  );
};

export default App;

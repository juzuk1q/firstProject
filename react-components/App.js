import React from 'react';
import './App.css';
import BasicComponents from './components/basic/BasicComponents';
import StatefulComponents from './components/stateful/StatefulComponents';
import LifecycleComponents from './components/lifecycle/LifecycleComponents';
import HooksComponents from './components/hooks/HooksComponents';
import ComponentTests from './components/ComponentTests';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Практическая работа: React компоненты</h1>
        <p>Реализуйте компоненты в соответствующих файлах</p>
      </header>

      <main className="App-main">
        <BasicComponents />
        <StatefulComponents />
        <LifecycleComponents />
        <HooksComponents />
        <ComponentTests />
      </main>
    </div>
  );
}

export default App;

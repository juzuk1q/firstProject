import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Contact from './components/Contact';
import ContactSuccess from './components/ContactSuccess';
import NotFound from './components/NotFound';
import './App.css';

// Корневой компонент с конфигурацией маршрутов и шапкой
function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Мой Магазин</h1>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/products">Товары</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
            </ul>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact/success" element={<ContactSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

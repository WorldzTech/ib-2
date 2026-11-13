import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

// Lazy: the password page pulls in the ~400 KB password dictionary, keep it off the home page.
const Dossier = lazy(() => import('./pages/Dossier'));
const Password = lazy(() => import('./pages/Password'));
const Footprint = lazy(() => import('./pages/Footprint'));
const Mosaic = lazy(() => import('./pages/Mosaic'));

function App() {
  return (
    <Router>
      <div className="app">
        <Link to="/" className="logo">Академия Безопасности Ozon</Link>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dossier" element={<Suspense><Dossier /></Suspense>} />
            <Route path="/password" element={<Suspense><Password /></Suspense>} />
            <Route path="/footprint" element={<Suspense><Footprint /></Suspense>} />
            <Route path="/mosaic" element={<Suspense><Mosaic /></Suspense>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

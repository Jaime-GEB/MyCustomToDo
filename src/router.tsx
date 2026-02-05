import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));

const AppRouter = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {/* Redirección condicional desde '/' */}
                <Route path="/*" element={
                    <Navigate to="/Home" />
                } />
                {/* Ruta de MainMenu */}
                <Route path="/Home" element={
                   <Home />
                } />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
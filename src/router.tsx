import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Home = lazy(() => import('./pages/Home'));

const AppRouter = () => {

    return (
        <Suspense fallback={
            <main className="h-full w-full flex justify-center items-center ">
              <CircularProgress />
            </main>
        }>
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
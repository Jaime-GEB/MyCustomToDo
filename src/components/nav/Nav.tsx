// Componente de la Barra de Navegación (Navbar)
import ThemeToggle from "../ThemeToggle";
import { useThemeStore } from "../../store/themeStore";
import { useEffect } from "react";
import TabBar from '../tabBar/TabBar';
import { type Dispatch, type SetStateAction } from "react";

const Nav = ({ value, setValue }: { value: string, setValue: Dispatch<SetStateAction<string>> }) => {
    const { theme } = useThemeStore();


    // Efecto para aplicar la clase 'dark' al documento HTML según el tema seleccionado
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <nav className="flex flex-row p-3 md:px-6 justify-between items-center border-b border-slate-200 dark:border-slate-800 bg-grey-200 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">

            {/* Titulo de la pagina */}
            <div className="flex flex-col items-center justify-center gap-2 mr-3 min-w-20">
                <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">To Do</h1>
                <footer className="text-slate-600 text-xs">v.1.0.3</footer>
            </div>

            <TabBar value={value} setValue={setValue} />

            {/* Controles de la derecha: Cambio de tema y Botón de Logout */}
            <div className="flex items-center">
                <ThemeToggle />
            </div>
        </nav>
    );
}
export default Nav;

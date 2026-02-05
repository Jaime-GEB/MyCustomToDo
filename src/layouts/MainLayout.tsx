// Componente de layout principal para cada una de las páginas principales

import Nav from "../components/nav/Nav";
import { type Dispatch, type SetStateAction } from "react";

const MainLayout = ({ children, value, setValue }: { children: React.ReactNode | null, value: string, setValue: Dispatch<SetStateAction<string>> }) => {

    return (
        <main className="relative h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
            <div className="mx-auto w-screen flex flex-col h-full">
                <Nav value={value} setValue={setValue} />

                {/* Main Section */}
                <section className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-16">
                    <div className="max-w-screen mx-auto w-full">
                        {children}
                    </div>
                </section>
            </div >
        </main >
    );
};
export default MainLayout;
import { useEffect, useRef, useState } from "react";

 const useTimer = (sec = 1000) => {
    const [isRunning, setIsRunning] = useState(false);
    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [horas, setHoras] = useState(0);
    const id = useRef<number | null>(null);

    useEffect(() => {
        if (!isRunning) return;
        id.current = globalThis.setInterval(() => {
            setSegundos(prev => prev + 1);
            if(segundos>=60){
                setMinutos(prev=>prev+1);
                setSegundos(0);
            }
            if(minutos>=60){
                setHoras(prev=> prev+1);
                setMinutos(0);
                setSegundos(0);
            }
        }, sec) as unknown as number;
        

        return () => {
            if (id.current) clearInterval(id.current);
        };
    }, [isRunning,segundos, minutos, sec]);

    return {
        isRunning,
        segundos,
        minutos,
        horas,
        reset: () => setSegundos(0),
        toggle: () => setIsRunning(v => !v),
    };
}

export default useTimer
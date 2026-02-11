import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const AlarmScrubber = ({ value, unit, isSet, onChange }: { value: number, unit: string, isSet: boolean, onChange: (val: number) => void }) => {
  const [editing, setEditing] = useState(isSet);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);
  const ITEM_HEIGHT = 50; // Altura base para el dial

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startYRef.current = e.clientY;
    startValueRef.current = value;

    const maxInput = unit === 'hours' ? 23 : 59;

    const handleMove = (eMove: MouseEvent) => {
      const deltaY = eMove.clientY - startYRef.current;
      // Sensibilidad ajustada para que el movimiento se sienta táctil
      const newValue = startValueRef.current - Math.round(deltaY / 12);

      if (Math.min(maxInput, Math.max(0, newValue)) !== value) {
        onChange(Math.min(maxInput, Math.max(0, newValue)));
      }
    };

    const handleUp = () => {
      globalThis.removeEventListener("mousemove", handleMove);
      globalThis.removeEventListener("mouseup", handleUp);
    };

    globalThis.addEventListener("mousemove", handleMove);
    globalThis.addEventListener("mouseup", handleUp);
  };

  const numbers = Array.from({ length: unit === 'hours' ? 24 : 60 }, (_, i) => i);

  return (
    <button className="flex items-center border-2 border-slate-300 dark:border-slate-700 rounded-2xl select-none cursor-ns-resize h-44 min-w-[120px] bg-slate-50 dark:bg-slate-900 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setEditing(true)}
      style={{ perspective: '1000px' }} // Añadimos perspectiva para el efecto 3D
    >
      {/* Sombras y degradados para efecto 3D Dial Profundo */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-slate-50 via-transparent to-slate-50 dark:from-slate-900 dark:via-transparent dark:to-slate-900" />
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_15px_30px_rgba(0,0,0,0.1),_inset_0_-15px_30px_rgba(0,0,0,0.1)]" />

      {/* Guía central con brillo */}
      <div className="absolute left-0 right-0 h-14 bg-blue-500/10 dark:bg-blue-500/20 border-y-2 border-blue-500/30 pointer-events-none top-1/2 -translate-y-1/2 z-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]" />

      {editing ? (
        <input
          autoFocus
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onBlur={() => setEditing(false)}
          className="relative z-20 w-full text-center border-none outline-none text-6xl bg-transparent font-bold text-blue-600 dark:text-blue-400"
        />
      ) : (
        <div className="relative w-full h-full overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center"
            style={{ top: '50%', marginTop: -ITEM_HEIGHT / 2, transformStyle: 'preserve-3d' }}
            animate={{ y: -value * ITEM_HEIGHT }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {numbers.map((num) => {
              const distance = Math.abs(value - num);
              const rotation = (num - value) * 15; // Ángulo de rotación basado en la distancia

              return (
                <motion.div
                  key={num}
                  className="flex items-center justify-center transition-colors duration-300"
                  animate={{
                    rotateX: rotation,
                    z: -distance * 10,
                    opacity: distance === 0 ? 1 :
                      distance === 1 ? 0.5 :
                        distance === 2 ? 0.2 : 0,
                    scale: distance === 0 ? 1.2 :
                      distance === 1 ? 0.9 : 0.7
                  }}
                  style={{
                    height: ITEM_HEIGHT,
                    fontSize: '3.5rem',
                    color: value === num ? '#3b82f6' : 'inherit',
                    fontWeight: value === num ? 800 : 400,
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {num.toString().padStart(2, "0")}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </button>
  );
}

export default AlarmScrubber;
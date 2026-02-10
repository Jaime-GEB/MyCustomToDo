import React, { useRef, useState } from "react";


const AlarmScrubber= ({value, unit, isSet, onChange}: {value: number, unit: string, isSet: boolean, onChange: (val: number) => void}) => {
  const [editing, setEditing] = useState(isSet);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startYRef.current = e.clientY;
    startValueRef.current = value;

    const maxInput = unit==='hours'? 23 : 59 ;
 
    const handleMove = (eMove: MouseEvent) => {
      const deltaY = eMove.clientY - startYRef.current;
      const valueWhenUp = startValueRef.current - Math.round(deltaY);

      onChange(Math.min(maxInput, Math.max(0, Math.round(valueWhenUp/20))));
    };

    const handleUp = () => {
      globalThis.removeEventListener("mousemove", handleMove);
      globalThis.removeEventListener("mouseup", handleUp);
    };

    globalThis.addEventListener("mousemove", handleMove);
    globalThis.addEventListener("mouseup", handleUp);
  };

  return (
    <button className="inline-flex items-center border-2 p-2 border-gray-700 rounded-xl select-none cursor-ns-resize"
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          autoFocus
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onBlur={() => setEditing(false)}
          className="w-full text-center border-none outline-none"
        />
      ) : (
        <span className="w-full text-center text-5xl">{value.toString().padStart( 2,"0")}</span>
      )}
    </button>
  );
}
export default AlarmScrubber;
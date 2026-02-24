// Handles.jsx - Input/Output handles for nodes
import React from 'react';
import { Handle, Position } from 'reactflow';

export const Handles = ({ handles = [], type, nodeId }) => {
  if (!handles || handles.length === 0) return null;

  const position = type === 'target' ? Position.Left : Position.Right;
  const totalHandles = handles.length;

  return (
    <>
      {handles.map((handle, index) => {
        // Calculate vertical position for each handle
        const topPercent = totalHandles === 1 
          ? 50 
          : 25 + (index * (50 / (totalHandles - 1 || 1)));

        return (
          <div key={`${nodeId}-${handle.id}`}>
            <Handle
              type={type}
              position={position}
              id={`${nodeId}-${handle.id}`}
              className={`
                !w-3 !h-3 !bg-slate-300 !border-2 !border-slate-500
                hover:!bg-blue-400 hover:!border-blue-500 hover:!scale-125
                transition-all duration-150
              `}
              style={{ top: `${topPercent}%` }}
            />
            {/* Handle Label */}
            <span 
              className={`
                absolute text-[10px] text-slate-400 font-medium
                ${type === 'target' ? 'left-5' : 'right-5'}
                pointer-events-none whitespace-nowrap
              `}
              style={{ top: `${topPercent}%`, transform: 'translateY(-50%)' }}
            >
              {handle.label}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default Handles;

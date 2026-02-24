// NodeHeader.jsx - Header component for nodes
import React from 'react';

export const NodeHeader = ({ title, icon, gradient }) => {
  return (
    <div className={`
      bg-gradient-to-r ${gradient}
      px-4 py-3 rounded-t-xl
      flex items-center gap-2
      border-b border-white/10
    `}>
      <span className="text-lg">{icon}</span>
      <h3 className="text-white font-semibold text-sm tracking-wide uppercase">
        {title}
      </h3>
    </div>
  );
};

export default NodeHeader;

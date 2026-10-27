import React from 'react';

export default function Notice({ type = 'info', children }) {
  if (!children) return null;

  return (
    <div
      className={`notice notice-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
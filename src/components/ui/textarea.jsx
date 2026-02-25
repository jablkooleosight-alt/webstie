import React from 'react';

export function Textarea({ className, ...props }) {
  return <textarea className={`border rounded p-2 ${className}`} {...props} />;
}
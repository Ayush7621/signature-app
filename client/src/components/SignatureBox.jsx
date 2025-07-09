import React from 'react';
import { useDrag } from 'react-dnd';

const SignatureBox = () => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'signature',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className="w-32 h-10 bg-blue-500 text-white text-center cursor-move rounded shadow"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      Signature
    </div>
  );
};

export default SignatureBox;
export const DraggableNode = ({ type, label, color }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      style={{ '--node-accent': color }}
      onDragStart={onDragStart}
      draggable
    >
      {label}
    </div>
  );
};

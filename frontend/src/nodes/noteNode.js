import { useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Note"
      accentColor="#fbbf24"
      style={{ background: '#1e1c10' }}
    >
      <textarea
        className="node-textarea note-textarea"
        value={note}
        rows={3}
        placeholder="Add a note..."
        onChange={(e) => {
          setNote(e.target.value);
          updateNodeField(id, 'note', e.target.value);
        }}
      />
    </BaseNode>
  );
};

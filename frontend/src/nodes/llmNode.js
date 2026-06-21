import { useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="LLM"
      accentColor="#a78bfa"
      inputs={[
        { id: `${id}-system`, label: 'System' },
        { id: `${id}-prompt`, label: 'Prompt' },
      ]}
      outputs={[{ id: `${id}-response`, label: 'Response' }]}
    >
      <div className="node-field">
        <label className="node-label">Model</label>
        <select
          className="node-select"
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            updateNodeField(id, 'model', e.target.value);
          }}
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>
    </BaseNode>
  );
};

import { useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Output"
      accentColor="#f472b6"
      inputs={[{ id: `${id}-value`, label: 'Value' }]}
    >
      <div className="node-field">
        <label className="node-label">Name</label>
        <input
          className="node-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            updateNodeField(id, 'outputName', e.target.value);
          }}
        />
      </div>
      <div className="node-field">
        <label className="node-label">Type</label>
        <select
          className="node-select"
          value={outputType}
          onChange={(e) => {
            setOutputType(e.target.value);
            updateNodeField(id, 'outputType', e.target.value);
          }}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};

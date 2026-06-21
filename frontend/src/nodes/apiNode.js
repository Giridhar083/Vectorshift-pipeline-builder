import { useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="API"
      accentColor="#fb923c"
      inputs={[
        { id: `${id}-body`, label: 'Body' },
        { id: `${id}-headers`, label: 'Headers' },
      ]}
      outputs={[
        { id: `${id}-response`, label: 'Response' },
        { id: `${id}-status`, label: 'Status' },
      ]}
    >
      <div className="node-field">
        <label className="node-label">Method</label>
        <select
          className="node-select"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            updateNodeField(id, 'method', e.target.value);
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="node-field">
        <label className="node-label">URL</label>
        <input
          className="node-input"
          type="text"
          value={url}
          placeholder="https://"
          onChange={(e) => {
            setUrl(e.target.value);
            updateNodeField(id, 'url', e.target.value);
          }}
        />
      </div>
    </BaseNode>
  );
};

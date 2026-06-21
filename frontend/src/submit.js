import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-bar">
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Submit Pipeline'}
        </button>
      </div>

      {error && <div className="toast">{error}</div>}

      {result && (
        <div className="modal-overlay" onClick={() => setResult(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__title">Pipeline Result</div>

            <div className="modal__stats">
              <div className="modal__stat">
                <div className="modal__stat-value">{result.num_nodes}</div>
                <div className="modal__stat-label">Nodes</div>
              </div>
              <div className="modal__stat">
                <div className="modal__stat-value">{result.num_edges}</div>
                <div className="modal__stat-label">Edges</div>
              </div>
            </div>

            <div className={`modal__dag modal__dag--${result.is_dag ? 'yes' : 'no'}`}>
              {result.is_dag ? 'Valid DAG' : 'Contains a cycle — not a DAG'}
            </div>

            <button className="modal__close" onClick={() => setResult(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

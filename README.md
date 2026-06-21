# VectorShift Pipeline Builder

A drag-and-drop pipeline builder built with React (frontend) and FastAPI (backend). Users can drag nodes onto a canvas, connect them, and submit the pipeline to check how many nodes/edges it has and whether it forms a valid DAG.

## Project Structure

```
.
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js
│   │   │   ├── inputNode.js
│   │   │   ├── outputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── textNode.js
│   │   │   ├── apiNode.js
│   │   │   └── noteNode.js
│   │   ├── App.js
│   │   ├── ui.js
│   │   ├── store.js
│   │   ├── toolbar.js
│   │   ├── submit.js
│   │   ├── draggableNode.js
│   │   └── index.css
│   └── package.json
└── render.yaml
```

## Running Locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Runs at `http://localhost:8000`

**Frontend** (in a separate terminal)
```bash
cd frontend
npm install
npm start
```
Runs at `http://localhost:3000`

## Part 1 — Node Abstraction

`nodes/BaseNode.js` is a shared component that every node is built on. It takes a `title`, `accentColor`, `inputs`, `outputs`, and `children`, and handles the wrapper card, header, delete button, and handle positioning automatically.

All 4 original nodes (Input, Output, LLM, Text*) were refactored to use it, and 2 new nodes were added on top of it:

- **API** — method + URL fields, models an outbound API call
- **Note** — a sticky annotation with no handles, for documenting parts of a pipeline

*Text node uses the same visual structure but is implemented separately since it needs dynamic handles (see Part 3).

Adding a new node now takes ~20 lines — just the unique fields, no boilerplate.

## Part 2 — Styling

Dark theme defined entirely in `index.css` using CSS variables (`--bg`, `--surface`, `--border`, `--accent`). Each node type has its own accent color on the top border for quick visual identification. Toolbar, canvas, handles, modal, and buttons all share the same design tokens.

## Part 3 — Text Node Logic

In `nodes/textNode.js`:
- **Auto-resize**: height grows via `scrollHeight` on every keystroke; width grows based on the longest line, capped between 160–400px.
- **Dynamic variables**: typing `{{ name }}` creates a Handle on the left side of the node named after the variable, using a regex that matches valid JS identifier rules. Deleting the variable removes the handle.

## Part 4 — Backend Integration

- `submit.js` POSTs the current `nodes` and `edges` as JSON to `/pipelines/parse`.
- `backend/main.py` counts nodes/edges and runs a DFS-based cycle check to determine if the graph is a DAG, returning `{ num_nodes, num_edges, is_dag }`.
- The frontend shows the result in a modal with node/edge counts and a pass/fail DAG indicator.

## Deployment (Render)

`render.yaml` at the project root defines both services as a Render Blueprint.

1. Push this repo to GitHub.
2. On Render: New → Blueprint → connect the repo.
3. Render deploys `backend` (FastAPI) and `frontend` (static build) separately.
4. Copy the backend's live URL and update:
   - `allow_origins` in `backend/main.py`
   - `REACT_APP_API_URL` in `frontend/.env.production`
5. Push again — Render redeploys automatically.

No authentication is implemented, matching the assignment's scope.

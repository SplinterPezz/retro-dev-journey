import React, { Suspense, lazy } from 'react';
import type { CodeFixEditorProps } from './CodeFixEditor';
import './LazyCodeFixEditor.css';

// CodeMirror loads on first use, not with the Story scene.
const CodeFixEditor = lazy(() => import('./CodeFixEditor'));

const LazyCodeFixEditor: React.FC<CodeFixEditorProps> = (props) => (
  <Suspense fallback={<pre className="code-fix-loading">{props.initialCode}</pre>}>
    <CodeFixEditor {...props} />
  </Suspense>
);

export default LazyCodeFixEditor;

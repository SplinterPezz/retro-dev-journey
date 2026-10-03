import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import './CodeFixEditor.css';
import '../Common/pixel-button.css';

interface CodeFixEditorProps {
  initialCode: string;
  onSubmit: (code: string) => void;
  disabled?: boolean;
}

// Editable Java snippet for code-fix quiz questions. The player edits the
// buggy code and submits; the quiz compares the result to the expected code
// with whitespace ignored (see QuizPopup).
const CodeFixEditor: React.FC<CodeFixEditorProps> = ({ initialCode, onSubmit, disabled = false }) => {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="code-fix-editor">
      <CodeMirror
        value={code}
        extensions={[java()]}
        onChange={setCode}
        editable={!disabled}
        theme="dark"
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false }}
      />
      <button
        type="button"
        className="code-fix-submit pixel-button"
        disabled={disabled}
        onClick={() => onSubmit(code)}
      >
        Check fix
      </button>
    </div>
  );
};

export default CodeFixEditor;

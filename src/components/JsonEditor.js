import React from 'react';
import Editor from "@monaco-editor/react";

function JsonEditor({ json, onChange }) {
  const handleEditorChange = (value) => {
    try {
      const parsedJson = JSON.parse(value);
      onChange(parsedJson);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <Editor
      height="300px"
      defaultLanguage="json"
      defaultValue={JSON.stringify(json, null, 2)}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}

export default JsonEditor;



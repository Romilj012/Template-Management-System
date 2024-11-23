// import React from 'react';
// import Editor from "@monaco-editor/react";

// function JsonEditor({ json, onChange }) {
//   const handleEditorChange = (value) => {
//     try {
//       const parsedJson = JSON.parse(value);
//       onChange(parsedJson);
//     } catch (error) {
//       console.error('Invalid JSON:', error);
//     }
//   };

//   return (
//     <Editor
//       height="300px"
//       defaultLanguage="json"
//       defaultValue={JSON.stringify(json, null, 2)}
//       onChange={handleEditorChange}
//       options={{
//         minimap: { enabled: false },
//         automaticLayout: true,
//         formatOnPaste: true,
//         formatOnType: true,
//       }}
//     />
//   );
// }

// export default JsonEditor;

import React from 'react';
import Editor from "@monaco-editor/react";
import LLMAssistant from "./LLMAssistant";

function JsonEditor({ json, onChange }) {
    const handleEditorChange = (value) => {
        try {
            const parsedJson = JSON.parse(value);
            onChange(parsedJson);
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    };

    const applySuggestion = (suggestion) => {
        const updatedJson = { ...json, ...JSON.parse(suggestion) };
        onChange(updatedJson);
    };

    return (
        <div>
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
            <LLMAssistant context={json} onApplySuggestion={applySuggestion} />
        </div>
    );
}

export default JsonEditor;



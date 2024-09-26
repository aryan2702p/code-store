import { useState, useEffect } from "react";

type Snippet = {
  title: string;
  code: string;
};

type SnippetStorage = {
  [language: string]: Snippet[];
};

const predefinedLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "PHP",
  "TypeScript",
  "HTML",
  "CSS"
];

function Popup() {
  const [languages, setLanguages] = useState<string[]>(predefinedLanguages);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [newSnippet, setNewSnippet] = useState({ title: "", code: "", language: predefinedLanguages[0] });

  useEffect(() => {
    // Load saved snippets from storage when popup loads
    chrome.storage.local.get(["snippetsByLanguage"], (result) => {
      const snippetsByLanguage: SnippetStorage = result.snippetsByLanguage || {};
      const storedLanguages = Object.keys(snippetsByLanguage);
      setLanguages((prevLanguages) => Array.from(new Set([...prevLanguages, ...storedLanguages])));
    });
  }, []);

  const handleLanguageClick = (language: string) => {
    setCurrentLanguage(language);
    chrome.storage.local.get(["snippetsByLanguage"], (result) => {
      const snippetsByLanguage: SnippetStorage = result.snippetsByLanguage || {};
      setSnippets(snippetsByLanguage[language] || []);
    });
  };

  const handleSnippetSave = () => {
    if (newSnippet.title.trim() && newSnippet.code.trim()) {
      chrome.storage.local.get(["snippetsByLanguage"], (result) => {
        const snippetsByLanguage: SnippetStorage = result.snippetsByLanguage || {};
        const updatedSnippets = snippetsByLanguage[newSnippet.language] || [];
        updatedSnippets.push({ title: newSnippet.title, code: newSnippet.code });
        snippetsByLanguage[newSnippet.language] = updatedSnippets;
        
        chrome.storage.local.set({ snippetsByLanguage }, () => {
          // Optional: Handle error on set
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            alert("Error saving snippet.");
            return;
          }
          setNewSnippet({ title: "", code: "", language: predefinedLanguages[0] });
          handleLanguageClick(newSnippet.language); // Refresh the snippet list
        });
      });
    } else {
      alert("Please provide both title and code.");
    }
  };

  return (
    <div className="popup-container">
      {currentLanguage === null ? (
        <div>
          <h2>Select a Language</h2>
          <ul>
            {languages.map((language) => (
              <li key={language} onClick={() => handleLanguageClick(language)}>
                {language}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>{currentLanguage} Snippets</h2>
          <button onClick={() => setCurrentLanguage(null)}>Back to Languages</button>
          <ul>
            {snippets.map((snippet, index) => (
              <li key={index}>
                <h4>{snippet.title}</h4>
                <pre>{snippet.code}</pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(snippet.code);
                    alert("Code copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="add-snippet-form">
        <h3>Add a New Snippet</h3>
        <select
          value={newSnippet.language}
          onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Snippet Title"
          value={newSnippet.title}
          onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
        />
        <textarea
          placeholder="Code"
          value={newSnippet.code}
          onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
        />
        <button onClick={handleSnippetSave}>Save Snippet</button>
      </div>
    </div>
  );
}

export default Popup;
// import { useState, useEffect } from "react";
// import { Editor } from "@monaco-editor/react"; // Ensure you have this package installed

// type Snippet = {
//   title: string;
//   code: string;
// };

// type SnippetStorage = {
//   [language: string]: Snippet[];
// };

// const predefinedLanguages = [
//   "javascript",
//   "python",
//   "java",
//   "cpp",
//   "csharp",
//   "ruby",
//   "go",
//   "php",
//   "typescript",
//   "html",
//   "css"
// ];

// function Popup() {
//   const [languages, setLanguages] = useState<string[]>(predefinedLanguages);
//   const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
//   const [snippets, setSnippets] = useState<Snippet[]>([]);
//   const [newSnippet, setNewSnippet] = useState({ title: "", code: "", language: predefinedLanguages[0] });

//   useEffect(() => {
//     chrome.storage.local.get(["snippetsByLanguage"], (result) => {
//       const snippetsByLanguage: SnippetStorage = result.snippetsByLanguage || {};
//       const storedLanguages = Object.keys(snippetsByLanguage);
//       setLanguages((prevLanguages) => Array.from(new Set([...prevLanguages, ...storedLanguages])));
//     });
//   }, []);

//   const handleLanguageClick = (language: string) => {
//     setCurrentLanguage(language);
//     chrome.storage.local.get(["snippetsByLanguage"], (result) => {
//       const snippetsByLanguage: SnippetStorage = result.snippetsByLanguage || {};
//       setSnippets(snippetsByLanguage[language] || []);
//     });
//   };

//   const handleSnippetSave = () => {
//     if (newSnippet.title && newSnippet.code) {
//       chrome.storage.local.get(["snippetsByLanguage"], (result) => {
//         const snippetsByLanguage: SnippetStorage = result.snippetsByLanguage || {};
//         const updatedSnippets = snippetsByLanguage[newSnippet.language] || [];
//         updatedSnippets.push({ title: newSnippet.title, code: newSnippet.code });
//         snippetsByLanguage[newSnippet.language] = updatedSnippets;
//         chrome.storage.local.set({ snippetsByLanguage });
//         setNewSnippet({ title: "", code: "", language: predefinedLanguages[0] });
//         handleLanguageClick(newSnippet.language);
//       });
//     }
//   };

//   return (
//     <div className="popup-container">
//       {currentLanguage === null ? (
//         <div>
//           <h2>Select a Language</h2>
//           <ul>
//             {languages.map((language) => (
//               <li key={language} onClick={() => handleLanguageClick(language)}>
//                 {language}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <div>
//           <h2>{currentLanguage} Snippets</h2>
//           <button onClick={() => setCurrentLanguage(null)}>Back to Languages</button>
//           <ul>
//             {snippets.map((snippet, index) => (
//               <li key={index}>
//                 <h4>{snippet.title}</h4>
//                 <pre>{snippet.code}</pre>
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(snippet.code);
//                     alert("Code copied to clipboard!");
//                   }}
//                 >
//                   Copy
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <div className="add-snippet-form">
//         <h3>Add a New Snippet</h3>
//         <select
//           value={newSnippet.language}
//           onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
//         >
//           {languages.map((language) => (
//             <option key={language} value={language}>
//               {language}
//             </option>
//           ))}
//         </select>
//         <input
//           type="text"
//           placeholder="Snippet Title"
//           value={newSnippet.title}
//           onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
//         />
//         <Editor
//           height="300px" // Adjust the height as needed
//           language={newSnippet.language}
//           value={newSnippet.code}
//           onChange={(value) => setNewSnippet((prev) => ({ ...prev, code: value || "" }))}
//           options={{ theme: "vs-dark", fontSize: 14 }} // Dark theme and increased font size
//         />
//         <button onClick={handleSnippetSave}>Save Snippet</button>
//       </div>
//     </div>
//   );
// }

// export default Popup;

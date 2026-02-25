// src/App.jsx
import React, { useState } from "react";
import "./index.css"; // Import tvého CSS + Tailwind direktiv

function App() {
  const [laws, setLaws] = useState([
    { id: 1, title: "Zákon o ochraně spotřebitele", description: "Popis zákona..." },
    { id: 2, title: "Zákon o daních z příjmu", description: "Popis zákona..." },
  ]);

  const [newLaw, setNewLaw] = useState({ title: "", description: "" });

  const addLaw = () => {
    if (newLaw.title.trim() === "" || newLaw.description.trim() === "") return;
    setLaws([...laws, { ...newLaw, id: Date.now() }]);
    setNewLaw({ title: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 md:p-10">
      <h1 className="text-4xl font-bold mb-6">Přehled zákonů</h1>

      <div className="w-full max-w-xl mb-6">
        <input
          type="text"
          placeholder="Název zákona"
          value={newLaw.title}
          onChange={(e) => setNewLaw({ ...newLaw, title: e.target.value })}
          className="w-full p-3 mb-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="Popis zákona"
          value={newLaw.description}
          onChange={(e) => setNewLaw({ ...newLaw, description: e.target.value })}
          className="w-full p-3 mb-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        ></textarea>
        <button
          onClick={addLaw}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold transition-colors"
        >
          Přidat zákon
        </button>
      </div>

      <div className="w-full max-w-xl">
        {laws.map((law) => (
          <div
            key={law.id}
            className="mb-4 p-4 rounded border border-gray-700 bg-gray-800"
          >
            <h2 className="text-xl font-bold mb-1">{law.title}</h2>
            <p>{law.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
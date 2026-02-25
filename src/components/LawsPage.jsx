import React from "react";

const LawsPage = () => {
  // Pro demo data
  const laws = [
    { id: 1, title: "Zákon 1", content: "Text zákona 1..." },
    { id: 2, title: "Zákon 2", content: "Text zákona 2..." },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seznam zákonů</h2>
      {laws.map((law) => (
        <div key={law.id} className="mb-4 p-4 border rounded">
          <h3 className="font-semibold">{law.title}</h3>
          <p>{law.content}</p>
        </div>
      ))}
    </div>
  );
};

export default LawsPage;
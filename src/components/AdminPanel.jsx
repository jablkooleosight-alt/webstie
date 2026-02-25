import React from "react";

const AdminPanel = ({ currentUser }) => {
  const laws = [
    { id: 1, title: "Zákon 1", content: "Text zákona 1..." },
    { id: 2, title: "Zákon 2", content: "Text zákona 2..." },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {laws.map((law) => (
        <div key={law.id} className="mb-4 p-4 border rounded">
          <h3 className="font-semibold">{law.title}</h3>
          <textarea
            className="w-full p-2 border rounded mt-2"
            defaultValue={law.content}
            readOnly={currentUser.role === "ADMIN" ? false : true}
          />
          {currentUser.role === "SUPER_ADMIN" && (
            <button className="mt-2 bg-purple-600 text-white p-1 rounded">
              Smazat zákon
            </button>
          )}
        </div>
      ))}

      {currentUser.role === "SUPER_ADMIN" && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Přidat Admina</h3>
          <button className="bg-purple-600 text-white p-2 rounded">
            Vytvořit Admina
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
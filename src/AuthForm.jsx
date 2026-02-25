import React, { useState } from "react";
import bcrypt from "bcryptjs";

const AuthForm = ({ onLogin }) => {
  const [mode, setMode] = useState("register"); // "register" nebo "login"
  const [users, setUsers] = useState([]); // Uchovává registrované uživatele (jen pro demo)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (users.find((u) => u.username === formData.username)) {
      setError("Uživatel již existuje!");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(formData.password, salt);

    // Všichni noví uživatelé jsou OBČAN
    setUsers([...users, { ...formData, password: hash, role: "OBČAN" }]);

    setMode("login"); // po registraci přepne na login
    setFormData({ username: "", password: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = users.find((u) => u.username === formData.username);
    if (!user || !bcrypt.compareSync(formData.password, user.password)) {
      setError("Špatné jméno nebo heslo!");
      return;
    }

    onLogin(user); // posíláme přihlášeného uživatele nahoru
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white text-black rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">{mode === "register" ? "Registrace" : "Login"}</h2>
      <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Uživatelské jméno</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Heslo</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && <div className="text-red-600 font-semibold">{error}</div>}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
        >
          {mode === "register" ? "Registrovat" : "Přihlásit"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === "register" ? (
          <>
            Už máte účet?{" "}
            <button
              className="text-purple-600 hover:underline"
              onClick={() => setMode("login")}
            >
              Přihlásit se
            </button>
          </>
        ) : (
          <>
            Nemáte účet?{" "}
            <button
              className="text-purple-600 hover:underline"
              onClick={() => setMode("register")}
            >
              Registrovat
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
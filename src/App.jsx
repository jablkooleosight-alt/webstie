import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// =============================================
// LOCAL STORAGE DB
// =============================================

const getDB = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setDB = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// =============================================
// DEFAULT SUPERADMIN (oddělený)
// =============================================

const defaultUsers = [
  {
    username: "superadmin",
    password: "super123",
    role: "SUPERADMIN"
  }
];

const defaultLaws = [
  { id: "000", title: "Ústava", content: "Ústava + dodatky" }
];

// =============================================
// MAIN APP v1.0
// =============================================

export default function LawPortalV10() {

  const [users, setUsers] = useState(() =>
    getDB("users", defaultUsers)
  );

  const [laws, setLaws] = useState(() =>
    getDB("laws", defaultLaws)
  );

  const [logs, setLogs] = useState(() =>
    getDB("logs", [])
  );

  const [currentUser, setCurrentUser] = useState(null);

  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerPass, setRegisterPass] = useState("");

  const [selectedLaw, setSelectedLaw] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const [newLawTitle, setNewLawTitle] = useState("");
  const [newLawContent, setNewLawContent] = useState("");

  const isSuperAdmin = currentUser?.role === "SUPERADMIN";
  const isAdmin = currentUser?.role === "ADMIN";

  // =============================================
  // SAVE
  // =============================================

  useEffect(() => setDB("users", users), [users]);
  useEffect(() => setDB("laws", laws), [laws]);
  useEffect(() => setDB("logs", logs), [logs]);

  // =============================================
  // AUDIT LOG
  // =============================================

  const addLog = (action, message) => {
    setLogs(prev => [
      {
        time: new Date().toLocaleString(),
        user: currentUser?.username || "SYSTEM",
        action,
        message
      },
      ...prev
    ]);
  };

  // =============================================
  // AUTH
  // =============================================

  const register = () => {
    if (!registerName || !registerPass) return;

    if (users.find(u => u.username === registerName)) {
      alert("Uživatel existuje");
      return;
    }

    const newUser = {
      username: registerName,
      password: registerPass,
      role: "OBCAN"
    };

    setUsers([...users, newUser]);
    setRegisterName("");
    setRegisterPass("");
  };

  const login = () => {
    const user = users.find(
      u => u.username === loginName && u.password === loginPass
    );

    if (!user) {
      alert("Špatné údaje");
      return;
    }

    setCurrentUser(user);
    addLog("LOGIN", `${user.username} se přihlásil`);
  };

  const logout = () => {
    addLog("LOGOUT", `${currentUser.username} se odhlásil`);
    setCurrentUser(null);
  };

  const deleteAccount = () => {
    if (!window.confirm("Opravdu smazat účet?")) return;

    setUsers(users.filter(u => u.username !== currentUser.username));
    addLog("DELETE_ACCOUNT", `${currentUser.username} smazal účet`);
    setCurrentUser(null);
  };

  // =============================================
  // ROLE MANAGEMENT (SUPERADMIN)
  // =============================================

  const promoteToAdmin = (username) => {
    setUsers(users.map(u =>
      u.username === username ? { ...u, role: "ADMIN" } : u
    ));
    addLog("PROMOTE", `${username} povýšen na ADMIN`);
  };

  // =============================================
  // LAW MANAGEMENT
  // =============================================

  const addLaw = () => {
    if (!newLawTitle || !newLawContent) return;

    setLaws([
      ...laws,
      {
        id: Date.now().toString(),
        title: newLawTitle,
        content: newLawContent
      }
    ]);

    addLog("ADD_LAW", `Přidán zákon ${newLawTitle}`);
    setNewLawTitle("");
    setNewLawContent("");
  };

  const saveEdit = () => {
    setLaws(laws.map(l =>
      l.id === selectedLaw.id
        ? { ...l, content: editContent }
        : l
    ));

    addLog("EDIT_LAW", `Upraven zákon ${selectedLaw.title}`);
    setEditing(false);
  };

  const deleteLaw = (id) => {
    setLaws(laws.filter(l => l.id !== id));
    addLog("DELETE_LAW", `Smazán zákon`);
    setSelectedLaw(null);
  };

  // =============================================
  // LOGIN SCREEN
  // =============================================

  if (!currentUser)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">
          San Andreas Government Portal v1.0
        </h1>

        {/* Registrace jen pokud není superadmin? NE – jen první registrace */}
        <div className="flex gap-2">
          <Input
            placeholder="Registrace jméno"
            value={registerName}
            onChange={e => setRegisterName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Heslo"
            value={registerPass}
            onChange={e => setRegisterPass(e.target.value)}
          />
          <Button onClick={register}>Registrovat</Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Login jméno"
            value={loginName}
            onChange={e => setLoginName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Heslo"
            value={loginPass}
            onChange={e => setLoginPass(e.target.value)}
          />
          <Button onClick={login}>Login</Button>
        </div>
      </div>
    );

  // =============================================
  // APP
  // =============================================

  return (
    <div className="min-h-screen p-6 bg-gray-100">

      <header className="flex justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">
            San Andreas Government
          </h1>
          <p>{currentUser.username} ({currentUser.role})</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={deleteAccount} variant="destructive">
            Smazat účet
          </Button>
          <Button onClick={logout}>Odhlásit</Button>
        </div>
      </header>

      {/* SUPERADMIN – správa uživatelů */}
      {isSuperAdmin && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-bold mb-2">Správa uživatelů</h2>
            {users.map(u => (
              <div key={u.username} className="flex justify-between mb-2">
                <span>{u.username} ({u.role})</span>
                {u.role === "OBCAN" && (
                  <Button onClick={() => promoteToAdmin(u.username)}>
                    Povýšit na ADMIN
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Přidávání zákona pouze SUPERADMIN */}
      {isSuperAdmin && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <Input
              placeholder="Název zákona"
              value={newLawTitle}
              onChange={e => setNewLawTitle(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Obsah zákona"
              value={newLawContent}
              onChange={e => setNewLawContent(e.target.value)}
              className="mb-2"
            />
            <Button onClick={addLaw}>Přidat zákon</Button>
          </CardContent>
        </Card>
      )}

      {/* SEZNAM ZÁKONŮ */}
      {laws.map(law => (
        <Card key={law.id} className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-bold">{law.title}</h2>

            {selectedLaw?.id === law.id ? (
              <>
                {editing ? (
                  <>
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                    />
                    <Button onClick={saveEdit}>Uložit</Button>
                  </>
                ) : (
                  <pre>{law.content}</pre>
                )}

                {(isSuperAdmin || isAdmin) && !editing && (
                  <Button
                    onClick={() => {
                      setEditing(true);
                      setEditContent(law.content);
                      setSelectedLaw(law);
                    }}
                  >
                    Upravit
                  </Button>
                )}

                {isSuperAdmin && (
                  <Button
                    variant="destructive"
                    onClick={() => deleteLaw(law.id)}
                  >
                    Smazat
                  </Button>
                )}

                <Button onClick={() => setSelectedLaw(null)}>
                  Zavřít
                </Button>
              </>
            ) : (
              <Button onClick={() => setSelectedLaw(law)}>
                Otevřít
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Audit log pouze SUPERADMIN */}
      {isSuperAdmin && (
        <Card className="mt-8">
          <CardContent className="p-4">
            <h2 className="font-bold mb-2">Audit Log</h2>
            <ul className="text-sm max-h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <li key={i}>
                  [{log.time}] ({log.user}) {log.action}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
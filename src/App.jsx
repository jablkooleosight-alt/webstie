import AuthForm from "./components/AuthForm";
import LawsPage from "./components/LawsPage";
import AdminPanel from "./components/AdminPanel";

const [currentUser, setCurrentUser] = useState(null);

return (
  <div className="min-h-screen bg-white text-black">
    {!currentUser ? (
      <AuthForm onLogin={setCurrentUser} />
    ) : (
      <>
        <h1>Vítej, {currentUser.username} ({currentUser.role})</h1>

        {currentUser.role === "OBČAN" && <LawsPage />}
        {currentUser.role === "ADMIN" && <AdminPanel currentUser={currentUser} />}
        {currentUser.role === "SUPER_ADMIN" && (
          <>
            <AdminPanel currentUser={currentUser} />
            {/* audit log */}
          </>
        )}
      </>
    )}
  </div>
);
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({
  user,
  onLogout,
}: {
  user: string | null;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = user ? user.split("@")[0] : "";

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-primary shadow">
      <div className="font-bold text-xl text-white">IA04</div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-semibold">{username}</span>
            <button
              className="px-4 py-2 bg-white text-primary rounded"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-md bg-white/20 p-1">
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/login") ? "bg-white text-primary" : "text-white/90"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/signup")
                    ? "bg-white text-primary"
                    : "text-white/90"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

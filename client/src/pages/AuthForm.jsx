import React, { useState } from "react";
import { Mail, User, Lock, Swords, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const { login, register } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regHunterName, setRegHunterName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in email and password");
      return;
    }

    try {
      setIsLoading(true);

      await login({
        email: loginEmail,
        password: loginPassword,
      });

      toast.success("Welcome back, Hunter!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!regEmail || !regPassword || !regUsername || !regHunterName) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      await register({
        email: regEmail,
        password: regPassword,
        username: regUsername,
        hunterName: regHunterName,
      });

      toast.success("Awakening complete! Welcome, Hunter.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md system-border system-glow bg-card/95 backdrop-blur-sm relative rounded-lg py-5">
        <div className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center system-border animate-pulse-glow">
                <Swords className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center border border-border">
                <Sparkles className="w-3 h-3 text-gold" />
              </div>
            </div>
          </div>

          <div className="text-2xl font-bold">
            <span className="system-text">SYSTEM</span>
          </div>
          <p className="text-muted-foreground">Solo Leveling Habit Tracker</p>
        </div>

        <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-md">
          <div className="grid grid-cols-2 mb-6 rounded-lg overflow-hidden bg-[#0f141a]">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "login" ? "text-white" : "text-[#7d8086]"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "register" ? "text-white" : "text-[#7d8086]"
              }`}
            >
              Awaken
            </button>
          </div>

          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="hunter@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary text-white py-2 disabled:opacity-50"
              >
                {isLoading ? "Connecting..." : "Enter the System"}
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="reg-email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="hunter@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-username" className="block mb-2 text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="sung_jinwoo"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-hunter-name" className="block mb-2 text-sm font-medium">
                  Hunter Name
                </label>
                <div className="relative">
                  <Swords className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="reg-hunter-name"
                    type="text"
                    placeholder="Shadow Monarch"
                    value={regHunterName}
                    onChange={(e) => setRegHunterName(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary text-white py-2 disabled:opacity-50"
              >
                {isLoading ? "Awakening..." : "Begin Awakening"}
              </button>
            </form>
          )}

          <div className="mt-6 p-3 rounded-lg border">
            <p className="text-xs text-center text-gray-500">
              <span className="font-mono font-semibold system-text">[SYSTEM]</span>{" "}
              Only the chosen ones can see this message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
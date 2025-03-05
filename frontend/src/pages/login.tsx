import { useState } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import api from "@/services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/users/login", { username, password });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        router.push("/dashboard"); // Redireciona para o Dashboard após login bem-sucedido
      } else {
        setError("Erro ao obter token. Tente novamente.");
      }
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600">Login</h1>

        {error && (
          <p className="text-red-500 text-center mt-3 p-2 bg-red-100 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700">Usuário</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
            />
          </div>

          {/* Campo de Senha com Ícone de Olho */}
          <div className="relative">
            <label className="block text-gray-700">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
            {/* Ícone de Mostrar/Ocultar Senha */}
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="mr-2 accent-blue-500"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Lembrar-me
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

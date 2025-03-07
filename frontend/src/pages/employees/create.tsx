import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { ArrowLeft } from "lucide-react";

export default function CreateEmployee() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    position: "",
    salary: "",
    hiringDate: "",
    phoneNumber: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Função para lidar com alterações nos campos
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para cadastrar o funcionário
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validação simples
    if (!formData.fullName || !formData.birthDate || !formData.position || !formData.salary || !formData.hiringDate) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        router.push("/login");
        return;
      }

      // Convertendo salário para número
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary),
      };

      await api.post("/employees", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setTimeout(() => router.push("/employees"), 2000); // Redireciona após sucesso
    } catch (err) {
      setError("Erro ao cadastrar funcionário. Tente novamente.");
      console.error("Erro no cadastro:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/employees")}
            className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Novo Funcionário</h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Funcionário cadastrado com sucesso!</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nome Completo *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Digite o nome completo"
            />
          </div>

          <div>
            <label className="block text-gray-700">Data de Nascimento *</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700">Cargo *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Digite o cargo"
            />
          </div>

          <div>
            <label className="block text-gray-700">Salário *</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Digite o salário"
            />
          </div>

          <div>
            <label className="block text-gray-700">Data de Contratação *</label>
            <input
              type="date"
              name="hiringDate"
              value={formData.hiringDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700">Telefone</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Opcional"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Cadastrar Funcionário
          </button>
        </form>
      </div>
    </div>
  );
}

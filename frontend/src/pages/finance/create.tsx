import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { ArrowLeft } from "lucide-react";

export default function CreateFinance() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    paymentMethod: "",
    type: "",
    referenceId: "",
  });

  const [employees, setEmployees] = useState([]);
  const [children, setChildren] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState([]);

  const categories = [
    "VT/VA",
    "Criança",
    "Salario",
    "Deposito",
    "Avulso",
    "Diaria Criança",
    "Judo",
    "Luz",
    "Internet",
    "Matricula",
    "Festa",
    "Comida",
  ];

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Nenhum token encontrado, redirecionando para login.");
          router.push("/login");
          return;
        }

        const employeesResponse = await api.get("/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const childrenResponse = await api.get("/children", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmployees(employeesResponse.data);
        setChildren(childrenResponse.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários e crianças:", error);
      }
    };

    fetchReferences();
  }, [router]);

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type, referenceId: "" });

    if (type === "Despesa") {
      setReferenceOptions(employees);
    } else if (type === "Faturamento") {
      setReferenceOptions(children);
    } else {
      setReferenceOptions([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { date, description, category, amount, paymentMethod, type, referenceId } = formData;

      let requestData = {
        date,
        description,
        category,
        amount: parseFloat(amount),
        paymentMethod,
        type,
      };

      // 🔹 **Log dos valores antes de enviar a requisição**
      console.log("🔹 Tipo da transação:", type);
      console.log("🔹 ID de referência selecionado:", referenceId);

      if (type === "Despesa" && referenceId) {
        requestData = { ...requestData, employeeId: parseInt(referenceId, 10) };
        console.log("✅ Adicionando employeeId:", requestData.employeeId);
      } else if (type === "Faturamento" && referenceId) {
        requestData = { ...requestData, childId: parseInt(referenceId, 10) };
        console.log("✅ Adicionando childId:", requestData.childId);
      }

      console.log("📤 Enviando dados para API:", requestData);

      const token = localStorage.getItem("token");
      await api.post("/finance", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/finance");
    } catch (error) {
      console.error("❌ Erro ao cadastrar transação:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/finance")}
            className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Nova Transação</h1>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Data</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Descrição</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Categoria</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione...</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Valor</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Forma de Pagamento</label>
            <input
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione...</option>
              <option value="Despesa">Despesa</option>
              <option value="Faturamento">Faturamento</option>
            </select>
          </div>

          {referenceOptions.length > 0 && (
            <div>
              <label className="block text-gray-700 font-medium">Referência</label>
              <select
                name="referenceId"
                value={formData.referenceId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Nenhuma</option>
                {referenceOptions.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { ArrowLeft } from "lucide-react";

export default function CreateFinance() {

  
  interface Category {
    id: number;
    name: string;
  }

  interface reference {
    id: number;
    fullName: string;
  }
  

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
    employeeId: "",
    childId: ""
  });

  const [employees, setEmployees] = useState([]);
  const [children, setChildren] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState<reference[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Nenhum token encontrado, redirecionando para login.");
          router.push("/login");
          return;
        }

        const categoriesResponse = await api.get("/category", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employeesResponse = await api.get("/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const childrenResponse = await api.get("/children", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories(categoriesResponse.data);
        setEmployees(employeesResponse.data);
        setChildren(childrenResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [router]);

  const handleTypeChange = (type: any) => {
    setFormData({ ...formData, type, referenceId: "" });

    if (type === "Despesa") {
      setReferenceOptions(employees);
    } else if (type === "Faturamento") {
      setReferenceOptions(children);
    } else {
      setReferenceOptions([]);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { date, description, category, amount, paymentMethod, type, referenceId, employeeId, childId } = formData;

      let requestData = {
        date,
        description,
        category,
        amount: parseFloat(amount),
        paymentMethod,
        type,
        employeeId: parseInt(referenceId, 10),
        childId: parseInt(referenceId, 10)
      };

      if (type === "Despesa" && referenceId) {
        requestData = { ...requestData };
      } else if (type === "Faturamento" && referenceId) {
        requestData = { ...requestData };
      }

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
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Descrição</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Categoria</label>
            <div className="flex items-center gap-2">
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => router.push("/categories/create")}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Valor</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Forma de Pagamento</label>
            <input type="text" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Tipo</label>
            <select name="type" value={formData.type} onChange={(e) => handleTypeChange(e.target.value)} className="w-full p-2 border rounded" required>
              <option value="">Selecione...</option>
              <option value="Despesa">Despesa</option>
              <option value="Faturamento">Faturamento</option>
            </select>
          </div>

          {referenceOptions.length > 0 && (
            <div>
              <label className="block text-gray-700 font-medium">Referência</label>
              <select name="referenceId" value={formData.referenceId} onChange={handleChange} className="w-full p-2 border rounded">
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
          <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { ArrowLeft, Plus } from "lucide-react";
import axios from "axios";

export default function FinanceList() {
   interface Child {
    id: number;
    fullName: string;
    }

    interface Employee {
      id: number;
      fullName: string;
      }
  

  const [financeData, setFinanceData] = useState([]);
  const [employees, setEmployees] = useState({});
  const [children, setChildren] = useState({});
  const router = useRouter();

  // Formatar valores monetários
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // Formatar datas para o padrão DD/MM/AAAA
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Nenhum token encontrado, redirecionando para login.");
          router.push("/login");
          return;
        }

        // Buscar transações financeiras
        const financeResponse = await api.get("/finance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFinanceData(financeResponse.data);

        // Buscar funcionários e crianças para mapear nomes
        const employeesResponse = await api.get("/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const childrenResponse = await api.get("/children", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Criar dicionários para facilitar a busca pelo nome
        const employeeMap: Record<number, string> = {}; // Definir como um objeto indexado pelo ID do funcionário
        employeesResponse.data.forEach((emp: Employee) => {
        employeeMap[emp.id] = emp.fullName;
        });

        const childrenMap: Record<number, string> = {}; // Definir como um objeto indexado pelo ID da criança
        childrenResponse.data.forEach((child: Child) => {
        childrenMap[child.id] = child.fullName;
        });

        setEmployees(employeeMap);
        setChildren(childrenMap);
        
      } catch (error: unknown) {
        console.error("Erro ao buscar funcionários:", error);
      
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            router.push("/login");
          }
        } else {
          console.error("Erro inesperado:", error);
        }
      }
      
    };

    fetchFinanceData();
  }, [router]);

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Financeiro</h1>
        </div>

        <button
          onClick={() => router.push("/finance/create")}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Nova Transação
        </button>
      </div>

      {/* Tabela de Financeiro */}
      <div className="rounded-lg shadow-md p-4 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left font-semibold">Data</th>
              <th className="p-4 text-left font-semibold">Descrição</th>
              <th className="p-4 text-left font-semibold">Categoria</th>
              <th className="p-4 text-left font-semibold">Valor</th>
              <th className="p-4 text-left font-semibold">Forma de Pagamento</th>
              <th className="p-4 text-left font-semibold">Tipo</th>
              <th className="p-4 text-left font-semibold">Referência</th>
            </tr>
          </thead>
          <tbody>
            {financeData.length > 0 ? (
              financeData.map(({ id, date, description, category, amount, paymentMethod, type, employeeId, childId }) => (
                <tr key={id} className="border-t border-gray-200 transition-all hover:bg-gray-100">
                  <td className="p-4 text-gray-700">{formatDate(date)}</td>
                  <td className="p-4 text-gray-700">{description}</td>
                  <td className="p-4 text-gray-700">{category}</td>
                  <td className="p-4 text-gray-700">{formatCurrency(amount)}</td>
                  <td className="p-4 text-gray-700">{paymentMethod}</td>
                  <td className={`p-4 ${type === "Faturamento" ? "text-green-500" : "text-red-500"}`}>
                    {type}
                  </td>
                  <td className="p-4">
                    {employeeId ? employees[employeeId] : childId ? children[childId] : "Outro"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-3">Nenhuma transação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

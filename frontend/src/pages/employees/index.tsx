import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import api from "@/services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const router = useRouter();

  // Função para formatar valores monetários
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // Buscar funcionários do backend
useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtém o token do usuário
      
              if (!token) {
                console.error("Token não encontrado. Usuário precisa fazer login.");
                router.push("/login");
                return;
              }
      
              const response = await api.get("/employees", {
                headers: { Authorization: `Bearer ${token}` }, // Adiciona o token no cabeçalho
              });
        setEmployees(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };
  
    fetchEmployees();
  
    // Temporariamente forçar isAdmin como verdadeiro para testar se os botões aparecem
    setIsAdmin(true);
  
    // Simulação de checagem de permissão de administrador
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setIsAdmin(userRole === "admin");
    }
  }, []);
  

  // Função para excluir funcionário
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtém o token do usuário
    
          if (!token) {
            console.error("Token não encontrado. Usuário precisa fazer login.");
            router.push("/login");
            return;
          }
    
          await api.delete(`/employees/${employeeToDelete.id}`, {
            headers: { Authorization: `Bearer ${token}` }, // Adiciona o token na requisição de exclusão
          });
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      setEmployeeToDelete(null); // Fechar modal
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Funcionários</h1>
        </div>

        {isAdmin && (
          <button
            onClick={() => router.push("/employees/create")}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Novo Funcionário
          </button>
        )}
      </div>

      {/* Tabela de Funcionários */}
      <div className="rounded-lg shadow-md p-4 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left font-semibold">Nome</th>
              <th className="p-4 text-left font-semibold">Cargo</th>
              <th className="p-4 text-left font-semibold">Salário</th>
              <th className="p-4 text-left font-semibold">Status</th>
              {isAdmin && <th className="p-3 text-left">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map(({ id, fullName, position, salary, status }) => (
                <tr key={id} className="border-t border-gray-200 transition-all hover:bg-gray-100">
                  <td className="p-4 text-gray-700">{fullName}</td>
                  <td className="p-4 text-gray-700">{position}</td>
                  <td className="p-4 text-gray-700">{formatCurrency(salary)}</td>
                  <td className={`p-4 ${status === "Ativo" ? "text-green-500" : "text-red-500"}`}>{status}</td>
                  {isAdmin && (
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => router.push(`/employees/edit/${id}`)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setEmployeeToDelete({ id, fullName })}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3">Nenhum funcionário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {employeeToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir {employeeToDelete.fullName}?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Moon, Sun, X } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import api from "@/services/api";


export default function Dashboard() {

  interface User {
    id: number;
    name: string;
    role: string;
  }
  
  interface FinancialStats {
    totalRevenue: number;
    totalRevenuePercentage: number;
    totalExpenses: number;
    totalExpensesPercentage: number;
    financialBalance: number;
    financialBalancePercentage: number;
    expectedRevenue: any;
  }
  
  interface Payment {
    id: number;
    fullName: string;
    dueDate: number;
    paymentDate: string;
    amountPaid: number;
    status: string;
    birthDate: Date;
    enrollmentDate: Date;
    schedule: string;
    turma: string;
    feeAmount: number;
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    motherPhone: string;
  }
  
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [financialData, setFinancialData] = useState<FinancialStats | null>(null);
  const [childrenPayments, setChildrenPayments] = useState<Payment[]>([]);
  const [selectedChild, setSelectedChild] = useState<Payment | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const selectedYear = new Date().getFullYear();
  const router = useRouter();

  // Função para formatar os valores corretamente como moeda brasileira
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

    const formatDate = (date: string | Date): string => {
      if (!date) return "N/A";
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      return parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      });
    };  

    const formatDueDate = (day: number): string => {
      if (!day || isNaN(day)) return "N/A";
      const year = new Date().getFullYear();
      const date = new Date(year, selectedMonth - 1, day);
      return date.toLocaleDateString("pt-BR");
    };
    
    

    const menuItems = [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Crianças", path: "/children" },
      { name: "Financeiro", path: "/finance" },
      { name: "Análises", path: "/analysis" },
      { name: "Funcionários", path: "/employees" },
      { name: "Configurações", path: "/settings" },
    ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Buscar informações do usuário
        const userResponse = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Buscar informações financeiras do mês selecionado
        const financialResponse = await api.get(
                  `/dashboard/stats-by-month?month=${selectedMonth}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
        setFinancialData(financialResponse.data);

        // Buscar lista de pagamentos das crianças
        const childrenResponse = await api.get(
                  `/dashboard/children-status?month=${selectedMonth}&year=${selectedYear}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!Array.isArray(childrenResponse.data)) {
                  console.error("❌ Erro: O backend retornou um formato inesperado!", childrenResponse.data);
                  return;
                }
        
                setChildrenPayments(childrenResponse.data);
              } catch (error) {
                console.error("❌ Erro ao buscar dados do backend:", error);
                localStorage.removeItem("token");
                router.push("/login");
              }
            };

    fetchData();
  }, [router, selectedMonth]); 

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  // Estrutura inicial dos dados do gráfico (placeholder)
  const sampleData = [
    { name: "Receita", value: 50, fill: "#8884d8" },
    { name: "Despesas", value: 30, fill: "#e74c3c" },
    { name: "Saldo", value: 70, fill: "#2ecc71" },
  ];
  
  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <aside className={`w-64 p-5 shadow-md flex flex-col h-screen ${darkMode ? "bg-gray-800" : "bg-white"}`}>
  <div>
    <h2 className="text-xl font-bold mb-5">
      Turminha do <span className="text-red-500">Chaves</span>
    </h2>
    <nav>
      <ul className="flex-grow">
        {menuItems.map(({ name, path }) => (
          <li
            key={name}
            onClick={() => {
              if (path === "/dashboard") {
                router.reload();
              } else {
                router.push(path);
              }
            }}
            className={`p-3 rounded cursor-pointer transition-all ${
              router.pathname === path
                ? darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-black"
                : darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-300"
            }`}
          >
            {name}
          </li>
        ))}
      </ul>
    </nav>
  </div>

  {/* Botão de Logout fixado no final */}
  <div className="mt-auto">
    <button
      onClick={handleLogout}
      className="p-2 bg-red-500 text-white rounded w-full hover:bg-red-600 transition-all"
    >
      Sair
    </button>
  </div>
  </aside>


      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {/* Selecionar Mês */}
          <input
            type="month"
            className="p-2 border rounded-md"
            value={`2025-${selectedMonth.toString().padStart(2, "0")}`}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value.split("-")[1], 10))}
          />

          <div className="flex items-center gap-6">
            {/* Mensagem do usuário no topo direito */}
            {user && (
              <div className="text-right text-gray-700">
                <p className="text-lg">
                  Olá, <span className="font-bold">{user.name}</span>
                </p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            )}
            
            {/* Toggle Modo Dark/Light */}
            <div
              className="relative w-16 h-8 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-all"
              onClick={() => setDarkMode(!darkMode)}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-900 rounded-full shadow-md transition-all transform ${
                  darkMode ? "translate-x-8" : ""
                }`}
              >
                {darkMode ? <Moon size={16} className="text-gray-300" /> : <Sun size={16} className="text-yellow-500" />}
              </div>
            </div>
          </div>
        </header>

        

       {/* Cards de Métricas */}
<section className="grid grid-cols-3 gap-6 mb-6">
  {financialData && (
    <>
      {[
        {
          title: "Receita Total",
          value: financialData.totalRevenue,
          percentage: financialData.totalRevenuePercentage,
          color: "#22c55e",
        },
        {
          title: "Total de Despesas",
          value: financialData.totalExpenses,
          percentage: financialData.totalExpensesPercentage,
          color: "#e74c3c",
        },
        {
          title: "Saldo Mensal",
          value: financialData.financialBalance,
          percentage: Math.abs(financialData.financialBalancePercentage),
          color: financialData.financialBalancePercentage >= 0 ? "#2ecc71" : "#e74c3c",
        },
      ].map(({ title, value, percentage, color }, index) => (
        <div
          key={index}
          className={`p-5 rounded-lg shadow-md flex items-center justify-between ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className={`text-2xl font-bold ${color === "#e74c3c" ? "text-red-500" : "text-green-500"}`}>
              {formatCurrency(value)}
            </p>
          </div>
          <div className="relative w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                barSize={6}
                data={[{ value: Math.min(percentage, 100) }]}
                startAngle={90}
                endAngle={90 + (percentage / 100) * 360}
              >
                <RadialBar
                  dataKey="value" 
                  fill={color} 
                  background 
                  cornerRadius={10} 
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <p
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold"
              style={{ color }}
            >
              {percentage}%
            </p>
          </div>
        </div>
      ))}
    </>
  )}
</section>
        {/* Tabela de Crianças */}
        <section>
          <h2 className="text-xl font-bold mb-3">Crianças</h2>
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="max-h-[500px] overflow-y-auto">
             <table className="w-full border-collapse">
              <thead>
                <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <th className="p-4 text-left font-semibold">Nome</th>
                <th className="p-4 text-left font-semibold">Data de Pagamento</th>
                <th className="p-4 text-left font-semibold">Data de Vencimento</th>
                <th className="p-4 text-left font-semibold">Valor Pago</th>
                <th className="p-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
              {childrenPayments.map((child) => (
                <tr
                  key={child.id}
                  onDoubleClick={() => setSelectedChild(child)}
                  className={`cursor-pointer transition-all ${darkMode ? "hover:bg-gray-700" : "border-t border-gray-200 hover:bg-gray-50"}`}
                >
                  <td className="p-4 text-gray-700">{child.fullName}</td>
                  <td className="p-4 text-gray-700">{formatDate(child.paymentDate)}</td>
                  <td className="p-4 text-gray-700">{formatDueDate(Number(child.dueDate))}</td>
                  <td className="p-4 text-gray-700">{formatCurrency(child.amountPaid)}</td>
                  <td className={`p-3 ${child.status === "Pago" ? "text-green-500" : "text-red-500"}`}>{child.status}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          </div>
        </section>
        {/* Modal */}
        {selectedChild && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedChild(null)}
          >
            <div
              className="bg-white p-6 rounded shadow-lg w-[95%] max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setSelectedChild(null)}
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 uppercase">{selectedChild.fullName}</h2>
              <p><strong>Data de Nascimento:</strong> {formatDate(selectedChild.birthDate)}</p>
              <p><strong>Data de Matrícula:</strong> {formatDate(selectedChild.enrollmentDate)}</p>
              <p><strong>Horário:</strong> {selectedChild.schedule}</p>
              <p><strong>Turma:</strong> {selectedChild.turma}</p>
              <p><strong>Mensalidade:</strong> {formatCurrency(selectedChild.feeAmount)}</p>
              <p><strong>Dia de Vencimento:</strong> {formatDueDate(selectedChild.dueDate)}</p>
              <p><strong>Nome do Pai:</strong> {selectedChild.fatherName}</p>
              <p><strong>Telefone Pai:</strong> {selectedChild.fatherPhone}</p>
              <p><strong>Nome da Mãe:</strong> {selectedChild.motherName}</p>
              <p><strong>Telefone Mãe:</strong> {selectedChild.motherPhone}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

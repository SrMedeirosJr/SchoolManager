import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { ArrowLeft, Plus } from "lucide-react";

export default function ChildrenList() {
  
  interface Child {
    id: number;
    fullName: string;
    birthDate: Date;       
    enrollmentDate: Date;  
    schedule: string;
    turma: string;
    feeAmount: number;     
    dueDate: Date;         
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    motherPhone: string;
}
  
  const [children, setChildren] = useState([]);
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  

  // Função para formatar valores monetários
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // Função para formatar datas no padrão DD/MM/AAAA
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Nenhum token encontrado, redirecionando para login.");
          router.push("/login");
          return;
        }

        const response = await api.get("/children", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChildren(response.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao buscar crianças:", error.message);
        }
      }
      
    };

    fetchChildren();
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
          <h1 className="text-2xl font-bold">Crianças Cadastradas</h1>
        </div>

        <button
          onClick={() => router.push("/children/create")}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Nova Criança
        </button>
      </div>

      {/* Tabela de Crianças */}
      <div className="rounded-lg shadow-md p-4 bg-white">
        <table className="w-full border-collapse">


        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 text-left font-semibold">Nome</th>
            <th className="p-4 text-left font-semibold">Data de Nascimento</th>
            <th className="p-4 text-left font-semibold">Data de Matrícula</th>
            <th className="p-4 text-left font-semibold">Horário</th>
            <th className="p-4 text-left font-semibold">Turma</th>
            <th className="p-4 text-left font-semibold">Mensalidade</th>
            <th className="p-4 text-left font-semibold">Dia de Vencimento</th>
            <th className="p-4 text-left font-semibold">Nome do Pai</th>
            <th className="p-4 text-left font-semibold">Telefone Pai</th>
            <th className="p-4 text-left font-semibold">Nome da Mãe</th>
            <th className="p-4 text-left font-semibold">Telefone Mãe</th>
          </tr>
        </thead>
        <tbody>
          {children.length > 0 ? (
            children.map(
              ({
                id,
                fullName,
                birthDate,
                enrollmentDate,
                schedule,
                class: turma,
                feeAmount,
                dueDate,
                fatherName,
                fatherPhone,
                motherName,
                motherPhone,
              }) => (
                <tr
                  key={id}
                  className="border-t border-gray-200 transition-all hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setSelectedChild({
                      id,
                      fullName,
                      birthDate,
                      enrollmentDate,
                      schedule,
                      turma,
                      feeAmount,
                      dueDate,
                      fatherName,
                      fatherPhone,
                      motherName,
                      motherPhone,
                    })
                  }
                >
                  <td className="p-4 text-gray-700">{fullName}</td>
                  <td className="p-4 text-gray-700">{formatDate(birthDate)}</td>
                  <td className="p-4 text-gray-700">{formatDate(enrollmentDate)}</td>
                  <td className="p-4 text-gray-700">{schedule}</td>
                  <td className="p-4 text-gray-700">{turma}</td>
                  <td className="p-4 text-gray-700">{formatCurrency(feeAmount)}</td>
                  <td className="p-4 text-gray-700">{dueDate}</td>
                  <td className="p-4 text-gray-700">{fatherName !== "-" ? fatherName : "Não informado"}</td>
                  <td className="p-4 text-gray-700">{fatherPhone !== "-" ? fatherPhone : "Não informado"}</td>
                  <td className="p-4 text-gray-700">{motherName !== "-" ? motherName : "Não informado"}</td>
                  <td className="p-4 text-gray-700">{motherPhone !== "-" ? motherPhone : "Não informado"}</td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={11} className="text-center p-3">
                Nenhuma criança encontrada.
              </td>
            </tr>
          )}
        </tbody>

        </table>
      </div>

      {/* Modal de Detalhes da Criança */}
      {selectedChild && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">{selectedChild.fullName}</h2>
            <p>
              <strong>Data de Nascimento:</strong> {formatDate(selectedChild.birthDate)}
            </p>
            <p>
              <strong>Data de Matrícula:</strong> {formatDate(selectedChild.enrollmentDate)}
            </p>
            <p>
              <strong>Horário:</strong> {selectedChild.schedule}
            </p>
            <p>
              <strong>Turma:</strong> {selectedChild.turma}
            </p>
            <p>
              <strong>Mensalidade:</strong> {formatCurrency(selectedChild.feeAmount)}
            </p>
            <p>
            <strong>Dia de Vencimento:</strong> {selectedChild.dueDate.toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Nome do Pai:</strong>{" "}
              {selectedChild.fatherName !== "-" ? selectedChild.fatherName : "Não informado"}
            </p>
            <p>
              <strong>Telefone Pai:</strong>{" "}
              {selectedChild.fatherPhone !== "-" ? selectedChild.fatherPhone : "Não informado"}
            </p>
            <p>
              <strong>Nome da Mãe:</strong>{" "}
              {selectedChild.motherName !== "-" ? selectedChild.motherName : "Não informado"}
            </p>
            <p>
              <strong>Telefone Mãe:</strong>{" "}
              {selectedChild.motherPhone !== "-" ? selectedChild.motherPhone : "Não informado"}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedChild(null)}
                className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

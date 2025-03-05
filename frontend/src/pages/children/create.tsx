import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import api from "@/services/api";

export default function CreateChild() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Função de envio do formulário
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Obter o token do localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Nenhum token encontrado, redirecionando para login.");
        router.push("/login");
        return;
      }
  
      // Configurar os headers com o token
      await api.post("/children", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      router.push("/children"); // Redireciona após criação
    } catch (error) {
      console.error("Erro ao cadastrar criança:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <button
            onClick={() => router.push("/children")}
            className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all flex items-center"
        >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
        </button>
        <h1 className="text-2xl font-bold">Nova Criança</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <input {...register("fullName", { required: true })} placeholder="Nome Completo" className="p-2 border rounded" />
          <input {...register("birthDate", { required: true })} type="date" className="p-2 border rounded" />
          <input {...register("enrollmentDate", { required: true })} type="date" className="p-2 border rounded" />
          <input {...register("schedule", { required: true })} placeholder="Horário" className="p-2 border rounded" />
          <input {...register("class", { required: true })} placeholder="Turma" className="p-2 border rounded" />
          <input {...register("feeAmount", { required: true })} type="number" placeholder="Mensalidade" className="p-2 border rounded" />
          <input {...register("dueDate", { required: true })} type="number" placeholder="Dia de Vencimento" className="p-2 border rounded" />
          <input {...register("fatherName")} placeholder="Nome do Pai" className="p-2 border rounded" />
          <input {...register("fatherPhone")} placeholder="Telefone do Pai" className="p-2 border rounded" />
          <input {...register("motherName")} placeholder="Nome da Mãe" className="p-2 border rounded" />
          <input {...register("motherPhone")} placeholder="Telefone da Mãe" className="p-2 border rounded" />
        </div>

        <button type="submit" className="mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

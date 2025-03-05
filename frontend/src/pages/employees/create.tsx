import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import api from "@/services/api";
import InputMask from "react-input-mask-next"; // 🚀 Substituído para evitar erro no React 18

// Esquema de validação
const employeeSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  birthDate: z.string().min(10, "Data inválida"),
  position: z.string().min(3, "Cargo obrigatório"),
  salary: z.string().min(1, "Salário obrigatório"),
  hiringDate: z.string().min(10, "Data de contratação inválida"),
  phoneNumber: z.string().min(14, "Telefone inválido"),
  status: z.enum(["Ativo", "Inativo"]),
});

export default function CreateEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  // Função de envio do formulário
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        salary: parseFloat(data.salary.replace("R$", "").replace(".", "").replace(",", ".")),
      };
      await api.post("/employees", formattedData);
      router.push("/employees");
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/employees")}
          className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold">Novo Funcionário</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-gray-700 font-medium">Nome Completo</label>
            <input
              {...register("fullName")}
              className="w-full p-2 border rounded"
              placeholder="Digite o nome"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-gray-700 font-medium">Cargo</label>
            <input
              {...register("position")}
              className="w-full p-2 border rounded"
              placeholder="Ex: Professor, Diretor..."
            />
            {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-gray-700 font-medium">Data de Nascimento</label>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
                  mask="99/99/9999"
                  className="w-full p-2 border rounded"
                  placeholder="DD/MM/AAAA"
                />
              )}
            />
            {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
          </div>

          {/* Data de Contratação */}
          <div>
            <label className="block text-gray-700 font-medium">Data de Contratação</label>
            <Controller
              name="hiringDate"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
                  mask="99/99/9999"
                  className="w-full p-2 border rounded"
                  placeholder="DD/MM/AAAA"
                />
              )}
            />
            {errors.hiringDate && <p className="text-red-500 text-sm">{errors.hiringDate.message}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-gray-700 font-medium">Telefone</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
                  mask="(99) 99999-9999"
                  className="w-full p-2 border rounded"
                  placeholder="(XX) XXXXX-XXXX"
                />
              )}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          {/* Salário */}
          <div>
            <label className="block text-gray-700 font-medium">Salário</label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
                  mask="R$ 9.999,99"
                  className="w-full p-2 border rounded"
                  placeholder="R$ 0,00"
                  onBlur={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    value = (parseInt(value, 10) / 100).toFixed(2).replace(".", ",");
                    setValue("salary", `R$ ${value}`);
                  }}
                />
              )}
            />
            {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select {...register("status")} className="w-full p-2 border rounded">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        {/* Botão de envio */}
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

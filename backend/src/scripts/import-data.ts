import * as path from 'path';
import * as xlsx from 'xlsx';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Finance } from '../finance/finance.entity';
import { Child } from '../children/child.entity';
import { Employee } from '../employees/employees.entity';

// Definir a estrutura do JSON do Excel
interface FinanceExcelData {
  "Data": number | string;  // Pode ser um número (serial Excel) ou string
  "Descrição": string;
  "Categoria": string;
  "ID da Criança"?: number;
  "ID do Funcionário"?: number;
  "Valor": number | string;
  "Forma de Pagamento": string;
  "Tipo": "Faturamento" | "Despesa";
}

// Configuração do banco
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'turminha_chave',
  entities: [Finance, Child, Employee],
  synchronize: false,
  logging: true,
});

// 🔹 Função para converter a data do Excel para um formato válido no JavaScript
function excelDateToJSDate(excelDate: number | string): Date {
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000); // Conversão do formato serial do Excel para timestamp
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Ajuste de fuso horário
  }
  return new Date(excelDate); // Se já for string, converte diretamente
}

async function importFinance() {
  try {
    await AppDataSource.initialize();

    // 📂 Caminho do arquivo Excel
    const filePath = path.join(__dirname, 'Financeiro.xlsx');
    const workbook = xlsx.readFile(filePath);

    // 📄 Ler a planilha financeira
    const financeSheet = workbook.Sheets[workbook.SheetNames[0]];
    const financeData: FinanceExcelData[] = xlsx.utils.sheet_to_json(financeSheet);

    // 🔹 Definir o array com tipagem correta
    const financeToInsert: Partial<Finance>[] = [];

    for (const finance of financeData) {
      const transaction: Partial<Finance> = {
        date: excelDateToJSDate(finance["Data"]), // Corrigida a conversão de data
        description: finance["Descrição"],
        category: finance["Categoria"],
        amount: parseFloat(finance["Valor"].toString().replace(',', '.')), // 🔹 Converte corretamente
        paymentMethod: finance["Forma de Pagamento"],
        type: finance["Tipo"], // 'Faturamento' ou 'Despesa'
      };

      // Associa a uma criança, se aplicável
      if (finance["ID da Criança"]) {
        transaction.child = { id: finance["ID da Criança"] } as Child;
      }

      // Associa a um funcionário, se aplicável
      if (finance["ID do Funcionário"]) {
        transaction.employee = { id: finance["ID do Funcionário"] } as Employee;
      }

      financeToInsert.push(transaction);
    }

    // 🔹 Salvar todas as transações financeiras no banco
    await AppDataSource.getRepository(Finance).save(financeToInsert);

    console.log('📊 Dados financeiros importados com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao importar dados:', err);
    process.exit(1);
  }
}

// Executar o script
importFinance();

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { ArrowLeft, ArrowRight, FileDown, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { getDiaSemanaComData } from "../Utilitarios/getDiaSemanaComData";
import { formatarValor } from "../Utilitarios/formatarValor";
import BotaoSair from "../BotaoSair";
import BtnHome from "../BotaoHome/BtnHome";

export default function HistoricoSemanal() {
  const [mesSelecionado, setMesSelecionado] = useState("");

  const [semanaAtual, setSemanaAtual] = useState(0);
  const [agendamentos, setAgendamentos] = useState([]);
  const [totalMes, setTotalMes] = useState(0); // 👈 total do mês

  useEffect(() => {
    buscarHistorico(semanaAtual);
  }, []);

  const buscarHistorico = async (semanaOffset) => {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaDaSemana + 1 + semanaOffset * 7);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    const inicioISO = new Date(inicioSemana.setHours(0, 0, 0, 0)).toISOString();
    const fimISO = new Date(fimSemana.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from("agendamentos")
      .select(`*, cliente:cliente_id ( nome )`)
      .gte("data", inicioISO)
      .lte("data", fimISO);

    if (error) {
      console.error("Erro ao buscar histórico:", error);
    } else {
      setAgendamentos(data);
    }

    await obterTotalMes(semanaOffset); // 👈 chama total do mês
  };

  const obterTotalMes = async (semanaOffset) => {
    const hoje = new Date();
    const referencia = new Date();
    referencia.setDate(hoje.getDate() + semanaOffset * 7);
  
    const inicioMes = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
    const fimMes = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
  
    const { data, error } = await supabase
      .from("agendamentos")
      .select("valor")
      .gte("data", inicioMes.toISOString())
      .lte("data", fimMes.toISOString());
  
    if (error) {
      console.error("Erro ao buscar total do mês:", error);
      return;
    }
  
    const total = data.reduce((soma, ag) => soma + (ag.valor || 0), 0);
    setTotalMes(total);
  
    const nomeMes = inicioMes.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    setMesSelecionado(nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)); // Capitaliza a primeira letra
  };
  

  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const data = agendamento.data;
    if (!data) return acc;
    if (!acc[data]) acc[data] = [];
    acc[data].push(agendamento);
    return acc;
  }, {});

  const totalSemana = agendamentos.reduce((soma, ag) => soma + (ag.valor || 0), 0);

  const exportarParaPDF = () => {
    const doc = new jsPDF();
    doc.text("Histórico Semanal", 14, 10);

    Object.entries(agendamentosAgrupados).forEach(([dia, ags], index) => {
      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20;
      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text(getDiaSemanaComData(ags[0]?.data || dia), 14, startY - 5);

      autoTable(doc, {
        startY: 20 + index * 60,
        head: [["Data", "Cliente", "Serviço", "Valor", "Pagamento"]],
        body: ags.map((agendamento) => [
          new Date(agendamento.data).toLocaleDateString("pt-BR"),
          agendamento.cliente?.nome || "Cliente não encontrado",
          agendamento.servico,
          formatarValor(agendamento.valor),
          agendamento.pagamento,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
      });
    });

    doc.save("historico-semanal.pdf");
  };

  const exportarParaExcel = (agendamentosAgrupados) => {
    const wb = XLSX.utils.book_new();

    Object.entries(agendamentosAgrupados).forEach(([dia, ags]) => {
      const dados = ags.map((agendamento) => ({
        Data: new Date(agendamento.data).toLocaleDateString("pt-BR"),
        Cliente: agendamento.cliente?.nome || "Cliente não encontrado",
        Serviço: agendamento.servico,
        Valor: agendamento.valor,
        Pagamento: agendamento.pagamento,
      }));

      const ws = XLSX.utils.json_to_sheet(dados);
      XLSX.utils.book_append_sheet(wb, ws, dia.slice(0, 31));
    });

    XLSX.writeFile(wb, "historico-semanal.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-primary text-white py-4 px-6 flex justify-between items-center mb-6 rounded-lg">
        <h2 className="text-xl font-bold">Histórico semanal</h2>
        <div className="flex gap-5">
          <BtnHome />
          <BotaoSair />
        </div>
      </header>
     
      <div className="grid grid-cols-2 gap-y-2 sm:flex sm:justify-between sm:items-center sm:gap-4 w-full mb-4">
  {/* Coluna esquerda - PDF e Excel */}
  <div className="flex flex-col gap-2">
    <button
      onClick={exportarParaPDF}
      className="w-36 flex items-center justify-center gap-1 px-3 py-1.5 text-sm sm:text-base bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      <FileText size={16} />
      PDF
    </button>
    <button
      onClick={() => exportarParaExcel(agendamentosAgrupados)}
      className="w-36 flex items-center justify-center gap-1 px-3 py-1.5 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      <FileDown size={16} />
      Excel
    </button>
  </div>

  {/* Coluna direita - Semana mais recente e anterior */}
  <div className="flex flex-col items-end gap-2">
    <button
      onClick={() => {
        const novaSemana = semanaAtual + 1;
        setSemanaAtual(novaSemana);
        buscarHistorico(novaSemana);
      }}
      className="w-36 flex items-center justify-center gap-1 px-3 py-1.5 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <ArrowRight size={16} />
      Mais recente
    </button>
    <button
      onClick={() => {
        const novaSemana = semanaAtual - 1;
        setSemanaAtual(novaSemana);
        buscarHistorico(novaSemana);
      }}
      className="w-36 flex items-center justify-center gap-1 px-3 py-1.5 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <ArrowLeft size={16} />
      Semana anterior
    </button>
  </div>
</div>



      {Object.entries(agendamentosAgrupados).length === 0 ? (
        <p className="text-gray-600">Nenhum agendamento encontrado para essa semana.</p>
      ) : (
        Object.entries(agendamentosAgrupados).map(([dia, ags]) => (
          <div key={dia} className="mb-6">
            <h2 className="text-lg font-semibold text-primary mb-2">- {getDiaSemanaComData(dia)} -</h2>
            <div className="overflow-x-auto border">
              <table className="w-full border border-gray-300 shadow rounded overflow-hidden">
                <thead className="border bg-violet-200 text-sm uppercase font-bold">
                  <tr>
                    <th className="border px-4 py-2">Data</th>
                    <th className="border px-4 py-2">Cliente</th>
                    <th className="border px-4 py-2">Serviço</th>
                    <th className="border px-4 py-2">Valor</th>
                    <th className="border px-4 py-2">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {ags.map((agendamento) => (
                    <tr className="border" key={agendamento.id}>
                      <td className="border px-4 py-2">
                        {new Date(agendamento.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="border px-4 py-2">
                        {agendamento.cliente?.nome || "Cliente não encontrado"}
                      </td>
                      <td className="border px-4 py-2">{agendamento.servico}</td>
                      <td className="border px-4 py-2">{formatarValor(agendamento.valor)}</td>
                      <td className="border px-4 py-2">{agendamento.pagamento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Totalizador */}
      <div className="mt-8 bg-gray-100 p-4 rounded shadow">
  <h3 className="text-lg font-semibold text-gray-700">Resumo Financeiro - {mesSelecionado}</h3>
  <p className="mt-2">
    💰 Total da semana: <span className="font-bold text-green-700">{formatarValor(totalSemana)}</span>
  </p>
  <p className="mt-1">
    📅 Total do mês: <span className="font-bold text-blue-700">{formatarValor(totalMes)}</span>
  </p>
</div>
      
    </div>
  );
}

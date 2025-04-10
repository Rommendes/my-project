//imports para impressão - bibliotecas
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
//import { saveAs } from "file-saver";

import { ArrowLeft, ArrowRight, FileDown, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { getDiaSemanaComData } from "../Utilitarios/getDiaSemanaComData";
import { formatarValor } from "../Utilitarios/formatarValor";
import BotaoSair from "../BotaoSair";
import BtnHome from "../BotaoHome/BtnHome";

export default function HistoricoSemanal() {
  const [semanaAtual, setSemanaAtual] = useState(0); 
  const [agendamentos, setAgendamentos] = useState([]);
  

  useEffect(() => {
    buscarHistorico(0);
  }, []);

  const buscarHistorico = async (semanaOffset) => {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // 0 = domingo
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaDaSemana + 1 + semanaOffset * 7); // segunda-feira
  
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6); // domingo
  
    const inicioISO = new Date(inicioSemana.setHours(0, 0, 0, 0)).toISOString();
    const fimISO = new Date(fimSemana.setHours(23, 59, 59, 999)).toISOString();
  
    console.log(`🔍 Semana ${semanaOffset} => de ${inicioISO} até ${fimISO}`);
  
    const { data, error } = await supabase
      .from("agendamentos")
      .select(`
        *,
        cliente:cliente_id ( nome )
        `)
      .gte("data", inicioISO)
      .lte("data", fimISO);
  
    if (error) {
      console.error("Erro ao buscar histórico:", error);
    } else {
      console.log("📦 Agendamentos recebidos:", data);
      setAgendamentos(data);
    }
  };
  
  const agendamentosAgrupados = agendamentos.reduce((acc, agendamento) => {
    const data = agendamento.data;
  
    if (!data) return acc; // Protege contra agendamento sem data
  
    if (!acc[data]) acc[data] = [];
    acc[data].push(agendamento);
    return acc;
  }, {});
  
  const exportarParaPDF = () => {
    const doc = new jsPDF();
    doc.text("Histórico Semanal", 14, 10);
  
    Object.entries(agendamentosAgrupados).forEach(([dia, ags], index) => {
      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20;

      // Título do dia
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
      XLSX.utils.book_append_sheet(wb, ws, dia.slice(0, 31)); // nome da aba (máx 31 caracteres)
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


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={exportarParaPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <FileText size={18} />
            Exportar para PDF
          </button>
          <button
            onClick={() => exportarParaExcel(agendamentosAgrupados)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
             <FileDown size={18} />
            Exportar para Excel
          </button>
      </div>

      <div className="flex justify-between items-center mb-4">
       
        <div className="flex gap-2">

        <button
            onClick={() => {
              const novaSemana = semanaAtual + 1;
              setSemanaAtual(novaSemana);
              buscarHistorico(novaSemana);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
             <ArrowRight size={18} />
            Semana mais recente
          </button>

          <button
            onClick={() => {
              const novaSemana = semanaAtual - 1;
              setSemanaAtual(novaSemana);
              buscarHistorico(novaSemana);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Semana anterior
          </button>


        </div>
      </div>
      </div>
      
    

      {Object.entries(agendamentosAgrupados).length === 0 ? (
        
        <p className="text-gray-600">Nenhum agendamento encontrado para essa semana.</p>
      ) : (
        Object.entries(agendamentosAgrupados).map(([dia, ags]) => (
          <div key={dia} className="mb-6">
            
            <h2 className="text-lg font-semibold text-primary mb-2">- {getDiaSemanaComData(dia)} -</h2>

            <div className="overflow-x-auto border">
            <table className="w-full border border-gray-300 shadow rounded overflow-hidden  ">
              <thead className="border bg-violet-200 text-sm uppercase  font-bold">
                <tr>
                  <th className="border px-4 py-2">Data</th>
                  <th className="border px-4 py-2">Cliente</th>
                  <th className="border px-4 py-2">Serviço</th>
                  <th className="border px-4 py-2">Valor</th>
                  <th className="border px-4 py-2">Pagamento</th>
                </tr>
              </thead>
              <tbody >
                {ags.map((agendamento) => (
                  <tr className="border" key={agendamento.id}>
                    <td className="border px-4 py-2">{new Date(agendamento.data).toLocaleDateString("pt-BR")}</td>
                    <td className="border px-4 py-2"> {agendamento.cliente?.nome || "Cliente não encontrado"}</td>
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
   

    </div>
  );
}
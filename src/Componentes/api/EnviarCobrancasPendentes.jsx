
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient.js"; // ajuste o caminho conforme seu projeto
import { formatarTelefoneParaCallMeBot } from "../Utilitarios/formatarTelefone.js"; // ajuste o caminho conforme seu projeto

const EnviarCobrancasPendentes = () => {
    const [status, setStatus] = useState([]);

  useEffect(() => {
    const enviarMensagens = async () => {
      const { data: agendamentos, error: agendamentoError } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("pagamento", "pendente");

      if (agendamentoError) {
        console.error("Erro ao buscar agendamentos:", agendamentoError);
        return;
      }

      for (const agendamento of agendamentos) {
        const { data: cliente, error: clienteError } = await supabase
          .from("clientes")
          .select("nome, telefone")
          .eq("id", agendamento.cliente_id)
          .single();

        if (clienteError || !cliente) {
          console.warn(`Erro ao buscar cliente ${agendamento.cliente_id}:`, clienteError);
          continue;
        }

        const telefone = formatarTelefoneParaCallMeBot(cliente.telefone);

        if (!telefone) {
          setStatus(prev => [...prev, `⚠️ Telefone inválido para ${cliente.nome}`]);
          continue;
        }

        const mensagem = `Olá ${cliente.nome}, você possui um pagamento pendente referente ao atendimento em ${agendamento.data} às ${agendamento.horario}. Por favor, regularize o quanto antes. Obrigado!`;
        const apikey = "8996545"; // seu apikey do CallMeBot

        const url = `https://api.callmebot.com/whatsapp.php?phone=${telefone}&text=${encodeURIComponent(mensagem)}&apikey=${apikey}`;

        try {
          const response = await fetch(url);
          const result = await response.text();

          setStatus(prev => [...prev, `✅ Mensagem enviada para ${cliente.nome}`]);
          console.log(`✅ Enviado para ${cliente.nome}:`, result);
        } catch (err) {
          setStatus(prev => [...prev, `❌ Erro ao enviar para ${cliente.nome}`]);
          console.error(`❌ Erro ao enviar mensagem para ${cliente.nome}:`, err);
        }
      }
    };

    enviarMensagens();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Envio de Cobranças Pendentes</h2>
      <ul className="space-y-2">
        {status.map((item, idx) => (
          <li key={idx} className="text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default EnviarCobrancasPendentes;

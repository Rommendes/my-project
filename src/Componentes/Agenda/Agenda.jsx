import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Pencil, Trash2, Save } from "lucide-react";
import BtnHome from "../BotaoHome/BtnHome";
import BotaoSair from "../BotaoSair//index";



function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

const AgendaAtendimento = () => {

  const [clientes, setClientes] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: "",
    horario: "",
    cliente_id: "",
    servico: "",
    valor: "",
    pagamento: "",
    obs: "",
  });
  const [agendamentos, setAgendamentos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({
    horario: "",
    servico: "",
    valor: "",
    pagamento: "",
    obs: ""
  });

  useEffect(() => {
    const buscarClientes = async () => {
      const { data, error } = await supabase.from("clientes").select("id, nome");
      if (error) console.error("Erro ao buscar clientes:", error);
      else setClientes(data);
    };
    buscarClientes();
  }, []);

  useEffect(() => {
    const buscarAgendamentos = async () => {
      const { data, error } = await supabase
        .from("agendamentos")
        .select(`
          id, data, horario, servico, valor, pagamento, obs, cliente_id,
          clientes ( nome )
        `)
        .order("data", { ascending: true })
        .order("horario", { ascending: true });
      if (error) console.error("Erro ao buscar agendamentos:", error);
      else setAgendamentos(data);
    };
    buscarAgendamentos();
  }, []);


  const salvarAgendamento = async () => {
    const { data, horario, cliente_id, servico, valor, pagamento } = novoAgendamento;
  
    // Validação antes de salvar
    if (!data || !horario || !cliente_id || !servico || !valor || !pagamento) {
      alert("Por favor, preencha todos os campos obrigatórios: data, horário, cliente, serviço e valor.");
      return;
    }
  
    // Converter valor para número com ponto
    const valorComPonto = valor.replace(",", ".");
    const valorConvertido = parseFloat(valorComPonto);
  
    if (isNaN(valorConvertido)) {
      alert("O valor informado é inválido. Use números (ex: 25.00 ou 25,00).");
      return;
    }
  
    const agendamentoFinal = { ...novoAgendamento, valor: valorConvertido };
  
    const { error } = await supabase.from("agendamentos").insert([agendamentoFinal]);
  
    if (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Erro ao salvar agendamento. Verifique os dados e tente novamente.");
    } else {
      // alert("Agendamento salvo com sucesso!");
      setNovoAgendamento({
        data: "",
        horario: "",
        cliente_id: "",
        servico: "",
        valor: "",
        pagamento: "",
        obs: "",
      });
      location.reload();
    }
  };
  


  const iniciarEdicao = (agendamento) => {
    setEditandoId(agendamento.id);
    setFormEdicao({
      horario: agendamento.horario,
      servico: agendamento.servico,
      valor: agendamento.valor,
      pagamento: agendamento.pagamento,
      obs: agendamento.obs
    });
  };

  const atualizarCampoEdicao = (campo, valor) => {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  };


  const salvarEdicao = async (id) => {
    // Conversão de valor
    const valorConvertido = parseFloat(formEdicao.valor.replace(",", "."));
  
    // Validação antes do update
    if (isNaN(valorConvertido)) {
      alert("O valor informado é inválido. Use números (ex: 25.00 ou 25,00).");
      return;
    }
  
    const { error } = await supabase
      .from("agendamentos")
      .update({ ...formEdicao, valor: valorConvertido })
      .eq("id", id);
  
    if (error) {
      console.error("Erro ao atualizar agendamento:", error);
      alert("Erro ao atualizar. Verifique os dados.");
    } else {
      alert("Agendamento atualizado com sucesso!");
      setEditandoId(null);
      location.reload();
    }
  };
  


  const excluirAgendamento = async (id) => {
    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (error) console.error("Erro ao excluir:", error);
    else {
      alert("Agendamento excluído com sucesso!");
      location.reload();
    }
  };

  const capitalizePrimeiraLetra = (string) => {

    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  

  const getDiaSemanaComData = (dataISO) => {
    const data = new Date(dataISO + "T12:00:00");
  const diaSemana = data.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
  const dataFormatada = data.toLocaleDateString("pt-BR");
  return `${capitalizePrimeiraLetra(diaSemana)} - ${dataFormatada}`;
    
  };
  

  const agendamentosAgrupadosPorDiaSemana = agendamentos.reduce((acc, agendamento) => {
    const diaSemana = getDiaSemanaComData(agendamento.data);
  
    if (!acc[diaSemana]) {
      acc[diaSemana] = [];
    }
    acc[diaSemana].push(agendamento);
    return acc;
  }, {});
  
//🧠 Função fecharSemana



  return (

      <div className="container mx-auto p-4">

        <header className="bg-primary text-white py-4 px-6 flex justify-between items-center mb-6 rounded-lg">
          <h2 className="text-xl font-bold">Agenda de Atendimentos</h2>
          <div className="flex gap-5">
            <BtnHome />
            <BotaoSair />
          </div>
        </header>

       
    
        {/* 🟡 FORMULÁRIO DE NOVO AGENDAMENTO */}
        <div className="w-full max-w-[100%] mx-auto border border-violet-100 p-4 rounded-lg bg-gray-50 shadow-lg">
  <h3 className="text-lg font-bold text-primary mb-4">Novo Agendamento</h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Data */}
    <div className="flex flex-col">
      <label className="text-sm  mb-1 px-1 ">Data</label>
      <input
        type="date"
        value={novoAgendamento.data}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, data: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-500 text-sm"
      />
    </div>

    {/* Horário */}
    <div className="flex flex-col">
      <label className="text-sm  mb-1 px-1">Horário</label>
      <input
        type="time"
        value={novoAgendamento.horario}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, horario: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-500 text-sm"
      />
    </div>

    {/* Cliente */}
    <div className="flex flex-col">
      <label className="text-sm  mb-1 px-1">Cliente</label>
      <select
        value={novoAgendamento.cliente_id}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, cliente_id: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-500 text-sm"
      >
        <option value="">Selecione um cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nome}
          </option>
        ))}
      </select>
    </div>

    {/* Pagamento */}
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1 px-1">Forma de Pagamento</label>
      <select
        value={novoAgendamento.pagamento}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, pagamento: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-500 text-sm"
      >
        <option value="">Selecione</option>
        <option value="Dinheiro">Dinheiro</option>
        <option value="Cartão">Cartão</option>
        <option value="Pix">Pix</option>
        <option value="Não pagou">Não pagou</option>
      </select>
    </div>

    {/* Serviço */}
    <div className="flex flex-col">
      <label className="text-sm  mb-1 px-1">Serviço</label>
      <select
        value={novoAgendamento.servico}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, servico: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-500 text-sm"
      >
        <option value="">Selecione</option>
        <option value="tintura">Tintura</option>
        <option value="Corte">Corte</option>
        <option value="escova progressiva">Escova progressiva</option>
        <option value="butox">Butox</option>
        <option value="manicure">Manicure</option>
        <option value="maquiagem">Maquiagem</option>
        <option value="sobrancelha">Sobrancelha</option>
      </select>
    </div>

    {/* Valor */}
    <div className="flex flex-col">
      <label className="text-sm  mb-1 px-1">Valor</label>
      <input
        type="text"
        placeholder="Valor"
        value={novoAgendamento.valor}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, valor: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-600 text-sm"
      />
    </div>

    {/* Observações */}
    <div className="flex flex-col md:col-span-2">
      <label className="text-sm  mb-1 px-1">Observações</label>
      <input
        type="text"
        placeholder="Observações"
        value={novoAgendamento.obs}
        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, obs: e.target.value })}
        className="w-full border px-3 py-2 rounded bg-white text-gray-500 text-sm"
      />
    </div>

    {/* Botão salvar */}
    <div className="flex items-end">
      <button
        onClick={salvarAgendamento}
        className="bg-secondary px-4 py-2 rounded hover:bg-alternativo text-white shadow flex items-center gap-2"
      >
        <Save size={20} />
        <span className="hidden sm:inline">Salvar</span>
      </button>
    </div>
  </div>
</div>

    
        {/* 🔵 AGRUPAMENTO POR DIA DA SEMANA */}

        <div className="w-full max-w-[100%] mx-auto pt-2 px-4  border border-[rgba(128,128,128,0.3)] p-4 rounded-lg bg-gray-50 shadow-lg mt-5">
       
        {Object.entries(agendamentosAgrupadosPorDiaSemana).map(([diaSemana, agendamentosDoDia]) => (
          <div key={diaSemana} className=" pt-5 pb-5 ">
            <h2 className="text-xl font-bold text-primary mb-0  relative pb-[-4px]  "> {diaSemana} </h2>
          

          <div className="overflow-x-auto">
            <table className="w-full border min-w-[700px]">
              <thead className="bg-violet-200 text-sm uppercase  font-bold ">
                <tr className="overflow-x-auto">
                  <th className="border-2 px-5 py-3">Data</th>
                  <th className="border-2 px-4 py-3">Horário</th>
                  <th className="border-2 px-2 min-w-[180px] text-center">Cliente</th>
                  <th className="border-2 px-4 py-3">Serviço</th>
                  <th className="border-2 px-4 py-3">Valor</th>
                  <th className="border-2 px-4 py-3">Pagamento</th>
                  <th className="border-2 px-2 min-w-[180px] text-center">Observações</th>
                  <th className="border-2 px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* 🔴 LISTAGEM DOS AGENDAMENTOS DO DIA */}
                {agendamentosDoDia.map((agendamento) => (
                  <tr key={agendamento.id} className="border">

                    <td className="border-2 px-4 py-3">
                    {new Date(agendamento.data + "T12:00:00").toLocaleDateString("pt-BR")}
                    </td>

                    <td className="p-2 border">
                      {editandoId === agendamento.id ? (
                        <input
                          value={formEdicao.horario}
                          onChange={(e) => atualizarCampoEdicao("horario", e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        agendamento.horario
                      )}
                    </td>
                    <td className="border-2 p-2 min-w-[250px] text-left ">{agendamento.clientes?.nome || "Sem nome"}</td>
                    <td className="border px-2 py-3 text-left">
                      {editandoId === agendamento.id ? (
                        <input
                          value={formEdicao.servico}
                          onChange={(e) => atualizarCampoEdicao("servico", e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        agendamento.servico
                      )}
                    </td>
                    <td className="p-2 border">
                      {editandoId === agendamento.id ? (
                        <input
                          value={formEdicao.valor}
                          onChange={(e) => atualizarCampoEdicao("valor", e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        formatarValor(agendamento.valor)
                      )}
                    </td>
                    <td className="p-2 border">
                      {editandoId === agendamento.id ? (
                        <input
                          value={formEdicao.pagamento}
                          onChange={(e) => atualizarCampoEdicao("pagamento", e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        agendamento.pagamento
                      )}
                    </td>
                    <td className="border-2 p-2 min-w-[250px] text-left ">
                      {editandoId === agendamento.id ? (
                        <input
                          value={formEdicao.obs}
                          onChange={(e) => atualizarCampoEdicao("obs", e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        agendamento.obs
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      {editandoId === agendamento.id ? (
                        <button
                          onClick={() => salvarEdicao(agendamento.id)}
                          className="text-green-600"
                        >
                          <Save size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() => iniciarEdicao(agendamento)}
                          className="text-yellow-500"
                        >
                          <Pencil size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => excluirAgendamento(agendamento.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ))}
         </div>
      </div>
    );
    
  
};

export default AgendaAtendimento;

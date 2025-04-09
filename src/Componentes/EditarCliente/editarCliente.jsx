
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

const EditarCliente = () => {
  const { id } = useParams(); // Pegando o ID do cliente pela URL
    const navigate = useNavigate();

  // Estado inicial corrigido para evitar inputs descontrolados
  const [cliente, setCliente] = useState(null); 

  useEffect(() => {
    const fetchCliente = async () => {
      console.log("Buscando cliente com ID:", id);
  
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single(); // ✅ Correto: apenas busca o cliente
  
      if (error) {
        console.error("Erro ao buscar cliente:", error);
        alert("Erro ao carregar dados do cliente.");
      } else {
        console.log("Dados do cliente carregados:", data);
        setCliente(data); // ✅ Atualiza o estado corretamente
      }
    };
  
    if (id) {
      fetchCliente();
    }
  }, [id]); // ✅ Executa sempre que o ID mudar
  

  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!cliente) {
      alert("Erro: Nenhum cliente carregado.");
      return;
    }

    console.log("🟢ID do cliente:", id);
    console.log("🟢Dados a serem atualizados:", cliente);

    const { data, error } = await supabase
      .from("clientes")
      .update({
        nome: cliente.nome,
        data_aniversario: cliente.dataAniversario,
        telefone: cliente.telefone,
        rua: cliente.rua,
      })
      .eq("id", id)
      .select(); // ✅ Garante que os dados atualizados sejam retornados

    if (error) {
      console.error("🔴Erro ao atualizar cliente:", error);
      alert("Erro ao atualizar cliente. Verifique o console.");
    } else {
      console.log("Cliente atualizado com sucesso:", data);
      alert("Cliente atualizado com sucesso!");

      navigate("/lista-clientes", { state: { updated: true }});
    }
  };

  if (!cliente) {
    return <p className="text-center text-lg font-bold text-red-500">Carregando dados do cliente...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-roxo">Editar Cliente</h2>
      <form onSubmit={handleSalvar} className="max-w-lg mx-auto mt-5 space-y-4 bg-white p-6 shadow-md rounded-lg">
        <label className="block">
          Nome:
          <input
            type="text"
            value={cliente.nome}
            onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
            className="block w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Data de Aniversário:
          <input
            type="date"
            value={cliente.data_aniversario}
            onChange={(e) => setCliente({ ...cliente, data_aniversario: e.target.value })}
            className="block w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Telefone:
          <input
            type="tel"
            value={cliente.telefone}
            onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
            className="block w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Rua:
          <input
            type="text"
            value={cliente.rua}
            onChange={(e) => setCliente({ ...cliente, rua: e.target.value })}
            className="block w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <div className="flex justify-between">
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
            Salvar Alterações
          </button>
          <button onClick={() => navigate("/lista-clientes")} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;

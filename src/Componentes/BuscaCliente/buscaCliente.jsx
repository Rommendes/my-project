
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const PesquisandoClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [resultados, setResultados] = useState([]); // 🔹 Começa vazia
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from("clientes").select("*");
      if (error) {
        console.error("Erro ao buscar clientes: ", error);
      } else {
        setClientes(data);
      }
    };
    fetchClientes();
  }, []);

  // 🔹 Buscar apenas o cliente pesquisado
  const handlePesquisa = (e) => {
    e.preventDefault();
    if (!search.trim()) return; // 🔹 Evita pesquisa vazia

    const filtrados = clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(search.toLowerCase())
    );

    setResultados(filtrados);
  };

  // 🔹 Função para excluir um cliente
  const handleExcluir = async (id) => {
    console.log("ID do cliente sendo excluído:", id);

    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir cliente:", error);
    } else {
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    }
  };

  const handleEditar = (id) => {
    navigate(`/editar-cliente/${id}`); // Certifique-se de que não há barra extra
  };

  return (
    <>
    <style>{`
      body {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
    
    <div className="container mx-auto p-4">
  {/* Container Principal */}
  
    
    {/* Cabeçalho */}
    <Header/>
    
    {/* Caixa de Pesquisa */}
    <div className="border-2 border-border-ligth rounded-lg shadow-lg p-20 bg-gray-50">
    <div className=" w-full max-w-[100%] mx-auto   ">
      <h2 className="text-2xl font-bold text-center mt-6 text-cinza">
        Pesquise um cliente para visualizar os dados
      </h2>

      <form onSubmit={handlePesquisa} className="max-w-md mx-auto pt-10 pb-10">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="text"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-400 rounded-lg bg-violet-200 focus:ring-2 focus:ring-roxinho focus:outline-none"
            placeholder="Pesquisar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="absolute end-2.5 bottom-2.5 text-white bg-secondary hover:bg-alternativo focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">
            Search
          </button>
        </div>
      </form>

      {/* Tabela de Resultados */}
      {resultados.length > 0 ? (
        <div className="overflow-x-auto pt-5">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-azulzinho text-center text-primary font-extrabold text-sm uppercase">
                <th className="border-2 border-primary px-6 py-4 min-w-[200px]">Nome</th>
                <th className="border-2 border-primary px-6 py-4 min-w-[200px]">Data de aniversário</th>
                <th className="border-2 border-primary px-6 py-4">Telefone</th>
                <th className="border-2 border-primary px-6 py-4 min-w-[200px]">Rua</th>
                <th className="border-2 border-primary px-6 py-4">Nº</th>
                <th className="border-2 border-primary px-6 py-4">Complemento</th>
                <th className="border-2 border-primary px-6 py-4">Bairro</th>
                <th className="border-2 border-primary px-6 py-4">Cidade</th>
                <th className="border-2 border-primary px-6 py-4">CEP</th>
                <th className="border-2 border-primary px-6 py-4 text-center">Editar</th>
                <th className="border-2 border-primary px-6 py-4 text-center">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition">
                  <td className="border-2 border-primary px-6 py-4 min-w-[200px]">{cliente.nome}</td>
                  <td className="border-2 border-primary px-6 py-4">{cliente.data_aniversario}</td>
                  <td className="border-2 border-primary px-6 py-4 min-w-[200px]">{cliente.telefone}</td>
                  <td className="border-2 border-primary px-6 py-4 min-w-[200px]">{cliente.rua}</td>
                  <td className="border-2 border-primary px-6 py-4">{cliente.numero}</td>
                  <td className="border-2 border-primary px-6 py-4">{cliente.complemento}</td>
                  <td className="border-2 border-primary px-6 py-4">{cliente.bairro}</td>
                  <td className="border-2 border-primary px-6 py-4">{cliente.cidade}</td>
                  <td className="border-2 border-primary px-6 py-4">{cliente.cep}</td>
                  <td className="border-2 border-primary px-3 py-2 text-center">
                    <button onClick={() => handleEditar(cliente.id)} className="text-yellow-500 hover:text-yellow-700 text-xl">
                      ✏️
                    </button>
                  </td>
                  <td className="border-2 border-primary px-3 py-2 text-center">
                    <button onClick={() => handleExcluir(cliente.id)} className="text-red-500 hover:text-red-700 text-xl">
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        search && <p className="text-center mt-4">Nenhum cliente encontrado.</p>
      )}
    </div>
    </div>
  


</div>

    </>
  );
};

export default PesquisandoClientes;

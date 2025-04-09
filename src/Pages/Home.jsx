
import { Link } from "react-router-dom";
import BotaoSair from "../Componentes/BotaoSair";
import minhaImagem from "../../src/assets/mulher.svg"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        body {
          
          min-height: 100vh;
          background: linear-gradient(to right, #3b82f6, #ec4899);
          align-items: center;
        }
      `}</style>
     
    <div className="bg-backgroundImage min-h-screen w-full flex justify-center items-center p-4">
      
      <div className="w-full max-w-md space-y-4">

        <div className="inline-flex items-end gap-1">
          <img src={minhaImagem} alt="Imagem" className="py-1 w-40 h-40 rounded-xl " />
          <h1 className="pb-4 align-text-bottom text-justify text-md text-cinza">
          Aqui mostro que o meu serviço é com excelência e
          <span className=" font-bold text-primary"> minhas clientes são especiais</span>.
          

          </h1>
        </div>

        <Link to="/agenda" className=" bg-blue-900 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-blue-800 transition">
          <span className="material-icons text-pink-400 text-4xl">event</span>
          <div>
            <h2 className="font-bold text-lg">Agenda</h2>
            <p className="text-sm">Horários, serviços realizados e valores.</p>
          </div>
        </Link>
        <Link to="/busca-cliente" className=" bg-blue-900 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-blue-800 transition">
          <span className="material-icons text-pink-400 text-4xl">search</span>
          <div>
            <h2 className="font-bold text-lg">Busca cliente</h2>
            <p className="text-sm">Pesquisa cliente cadastrado</p>
          </div>
        </Link>
        <Link to="/historico-cliente" className=" bg-blue-900 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-blue-800 transition">
          <span className="material-icons text-pink-400 text-4xl">history</span>
          <div>
            <h2 className="font-bold text-lg">Histórico Cliente</h2>
            <p className="text-sm">Busca por cliente cadastrado</p>
          </div>
        </Link>
        <Link to="/cadastrar-cliente" className=" bg-blue-900 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-blue-800 transition">
          <span className="material-icons text-pink-400 text-4xl">person_add</span>
          <div>
            <h2 className="font-bold text-lg">Cadastro</h2>
            <p className="text-sm">Cadastro completo ou essencial</p>
          </div>
        </Link>
        <Link to="/lista-clientes" className=" bg-blue-900 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-blue-800 transition">
          <span className="material-icons text-pink-400 text-4xl">group</span>
          <div>
            <h2 className="font-bold text-lg">Lista de Clientes</h2>
            <p>Aqui encontra-se todos os clientes cadastrados</p>
          </div>
        </Link>
{/**🖍️ histórico semanal */}
      <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-2xl font-bold">Bem-vindo(a)!</h1>
      <button
        onClick={() => navigate("/agenda")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Ir para Agenda
      </button>
      <button
        onClick={() => navigate("/historico-semanal")}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Ir para Histórico
      </button>
    </div>

        <div className="flex justify-center">
          
          <BotaoSair/>


        </div>

       
      </div>
      
    </div>
    
    
</>
  );
};

export default Home;

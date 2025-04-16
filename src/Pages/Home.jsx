import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import minhaImagem from "../assets/mulher.svg";
import BotaoSair from "../Componentes/BotaoSair/index.jsx";

export default function Home() {
  const [mostrarSubmenu, setMostrarSubmenu] = useState(false);
  const navigate = useNavigate();

  const toggleSubmenu = () => {
    setMostrarSubmenu(!mostrarSubmenu);
  };

  return (
    <div className="bg-backgroundImage min-h-screen w-full flex justify-center items-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* Imagem e mensagem de boas-vindas */}
        <div className="inline-flex items-end gap-1">
          <img
            src={minhaImagem}
            alt="Imagem"
            className="py-1 w-40 h-40 rounded-xl"
          />
          <h1 className="pb-4 text-justify text-md text-cinza">
            Aqui mostro que o meu serviço é com excelência e
            <span className="font-bold text-primary"> minhas clientes são especiais</span>.
          </h1>
        </div>

        {/* Botão de Agenda com submenu */}
        <div className="w-full">
          <button
            onClick={toggleSubmenu}
            className="botao-menu w-full"
          >
            <span className="material-icons text-secondary text-4xl">event</span>
            <div className="flex flex-col justify-center text-left">
              <h2 className="font-bold text-lg">Agenda</h2>
              <p className="text-sm">Horários, serviços realizados e valores.</p>
            </div>
          </button>

          {mostrarSubmenu && (
            <div className="mt-3 ml-8 space-y-2">
              <Link
                to="/agenda"
                className="botao-submenu-cor block w-full  text-white px-4 py-2 rounded-lg  text-center"
              >
                Agendamento de Atendimentos
              </Link>
              <button
                onClick={() => navigate("/historico-semanal")}
                className="botao-submenu-cor block w-full  text-white px-4 py-2 rounded-lg "
              >
                Ir para Histórico
              </button>
            </div>
          )}
        </div>

        {/* Outros botões */}
        <Link to="/busca-cliente" className="botao-menu w-full">
          <span className="material-icons text-secondary text-4xl">search</span>
          <div>
            <h2 className="font-bold text-lg">Busca cliente</h2>
            <p className="text-sm">Pesquisa cliente cadastrado</p>
          </div>
        </Link>

        <Link to="/historico-cliente" className="botao-menu w-full">
          <span className="material-icons text-secondary text-4xl">history</span>
          <div>
            <h2 className="font-bold text-lg">Histórico do Cliente</h2>
            <p className="text-sm">Busca por cliente cadastrado</p>
          </div>
        </Link>

        <Link to="/cadastrar-cliente" className="botao-menu w-full">
          <span className="material-icons text-secondary text-4xl">person_add</span>
          <div>
            <h2 className="font-bold text-lg">Cadastro</h2>
            <p className="text-sm">Cadastro completo ou essencial</p>
          </div>
        </Link>

        <Link to="/lista-clientes" className="botao-menu w-full">
          <span className="material-icons text-secondary text-4xl">group</span>
          <div>
            <h2 className="font-bold text-lg">Lista de Clientes</h2>
            <p className="text-sm">Aqui encontra-se todos os clientes cadastrados</p>
          </div>
        </Link>

        {/* Botão de sair */}
        <div className="flex justify-center">
          <BotaoSair />
        </div>
      </div>
    </div>
  );
}

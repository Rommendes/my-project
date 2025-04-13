import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Icon } from "@mui/material";

const BotaoSair = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao sair!");
    } else {
     
      navigate("/"); // ✅ Redireciona corretamente
    }
  };

  return (
    <>
    
    <button onClick={handleLogout}
        className="bg-secondary px-1.5 pt-1 rounded hover:bg-alternativo shadow-lg w-fit">
        <Icon className=" pb-2 text-2xl text-white ">exit_to_app</Icon>
        </button>

    </>
  );
};

export default BotaoSair;
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Icon } from "@mui/material";

const BtnHome = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao sair!");
    } else {
     
      navigate("/home"); // ✅ Redireciona corretamente
    }
  };

  return (
    <>
    
    <button onClick={handleLogout}
        className="bg-secondary px-1.5  py-1 pt-1 rounded hover:bg-alternativo shadow-lg">
        <Icon className=" pb-2 text-2xl text-white">home</Icon>
        </button>

    </>
  );
};

export default BtnHome;





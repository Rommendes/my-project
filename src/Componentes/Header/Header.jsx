import BtnHome from "../BotaoHome/BtnHome";
import BotaoSair from "../BotaoSair";

const Header = () => {
    return(

        <header className="bg-primary text-white py-4 px-6 flex justify-between items-center mb-6 rounded-lg">
      <h2 className="text-xl font-bold">Agenda de Atendimentos</h2>
      <div className="flex gap-5">
        <BtnHome />
        <BotaoSair />
      </div>
    </header>
    )
}
export default Header;
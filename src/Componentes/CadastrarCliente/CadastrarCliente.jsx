import { useState } from "react";
import { supabase } from "../../supabaseClient"; // Importe seu Supabase
import EnderecoForm from "../EnderecoForm";
import BtnHome from "../BotaoHome/BtnHome";
import BotaoSair from "../BotaoSair";

const CadastrarCliente = () => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    dataAniversario: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      cep: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Estado para indicar o carregamento


  // ✅ Função para validar número ou retornar null
  const toNullableNumber = (value) => {
    const trimmed = value.trim();
    return /^\d+$/.test(trimmed) ? parseInt(trimmed, 10) : null;
  };

  
  // Validação dos campos obrigatórios
  const validate = () => {
    let tempErrors = {};
    if (!formData.nome) tempErrors.nome = "O nome é obrigatório";
    if (!formData.telefone) {
      tempErrors.telefone = "O telefone é obrigatório";
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
      tempErrors.telefone = "Formato inválido. Use (99) 99999-9999";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Captura a mudança nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Captura a mudança nos campos do endereço
  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value },
    }));
  };

  // Função para cadastrar cliente no Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    try {
      const { error } = await supabase.from("clientes").insert([
        {
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          data_aniversario: formData.dataAniversario,
          rua: formData.endereco.rua,
          numero: toNullableNumber(formData.endereco.numero),
          complemento: formData.endereco.complemento,
          bairro: formData.endereco.bairro,
          cidade: formData.endereco.cidade,
          cep: toNullableNumber(formData.endereco.cep),
        },
      ]);

      if (error) throw error;

      alert("Cliente cadastrado com sucesso!");

      // Resetar formulário após sucesso
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        dataAniversario: "",
        endereco: {
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          cep: "",
        },
      });

      setErrors({});
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error.message);
      alert(`Erro ao cadastrar cliente: ${error.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };
 
  

  return (
    <>
     <style>{`
      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
      
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
      
    <div className=" items-center justify-center min-h-screen  px-4  ">
    <div className="container mx-auto mt-5 flex justify-center gap-10">
      <BtnHome/>
      <BotaoSair/>
    </div>

      <div className="bg-white sm:p-8 w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl  my-7 p-6 shadow-2xl rounded-lg">
        <div> 

        <div className="flex-wrap">
         
        <div className=" p-4 rounded ">
          <h2 className="text-2xl font-bold  text-center text-primary">Cadastro de Cliente</h2>
      </div>
      </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="text-left px-2 block font-medium">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.nome ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary`}
              />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
            </div>

            {/* Telefone */}
            <div>
              <label className="block font-medium text-left px-2">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(99) 99999-9999"
                className={`w-full p-2 border ${errors.telefone ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary`}
              />
              {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
            </div>

            {/* Data de aniversário */}
            <div>
              <label className="text-left px-2 block font-medium">Data de Aniversário:</label>
              <input
                type="date"
                name="dataAniversario"
                value={formData.dataAniversario}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-left px-2 block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary"
              />
            </div>

            {/* Endereço */}
            <EnderecoForm formData={formData.endereco} handleChange={handleEnderecoChange} />

            {/* Botão de cadastrar */}
            <button
              type="submit"
              className="w-full bg-primary text-white p-3 rounded-lg hover:bg-alternativo transition-all"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

           
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default CadastrarCliente;

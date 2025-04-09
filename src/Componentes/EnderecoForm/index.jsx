//import { useState } from "react";

const EnderecoForm = ({formData, handleChange  }) => {
 
  if (!formData) {
    return <p>Erro: Dados do endereço não foram carregados corretamente.</p>;
  }

  return (
    <div className="flex flex-col  shadow ">
    <p className="text-sm text-gray-500 mb-0  relative pb-[-4px]  ">(Opcional)</p>
    <div className="my-1 p-2  pb-5 border border-secondary rounded shadow">
         
    <h3 className="text-xl font-bold mb-2 pt-2 text-primary">Endereço</h3>
  
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block">Rua:</label>
        <input
          type="text"
          name="rua"
          value={formData.rua}
          onChange={handleChange  }
          placeholder="Nome da Rua"
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary"
        />
      </div>
  
      <div>
        <label className="block">Número:</label>
        <input
          type="text"
          name="numero"
          value={formData.numero }
          onChange={handleChange }
          placeholder="Número"
          className="w-full p-2 border rounded-lg border-gray-400  focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary"
        />
      </div>
  
      <div>
        <label className="block">Complemento:</label>
        <input
          type="text"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange }
          placeholder="Apartamento, Bloco, etc."
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary"
        />
      </div>
  
      <div>
        <label className="block">Bairro:</label>
        <input
          type="text"
          name="bairro"
          value={formData.bairro }
          onChange={handleChange }
          placeholder="Bairro"
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-cinzinha focus:outline-none focus:border-b-primary"
        />
      </div>
  
      <div>
        <label className="block">Cidade:</label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade }
          onChange={handleChange }
          placeholder="Nome da Cidade"
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-b-primary"
        />
      </div>
  
      <div>
        <label className="block">CEP:</label>
        <input
          type="text"
          name="cep"
          value={formData.cep }
          onChange={handleChange }
          placeholder="00000-000"
          maxLength={9}
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-b-primary"
        />
      </div>
    </div>
  </div>
  </div>
  );
};

export default EnderecoForm;

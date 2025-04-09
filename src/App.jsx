import React ,{ useState } from "react"
import {  Routes, Route} from "react-router-dom"
import 'material-icons/iconfont/material-icons.css'

// import './App.css'
import Login from './Pages/Login'
import Home from "./Pages/Home"
import CadastrarCliente from "./Componentes/CadastrarCliente/CadastrarCliente";
import ListaClientes from "./Componentes/ListaClientes/ListaClientes.jsx"
import EditarCliente from "./Componentes/EditarCliente/editarCliente.jsx"
import Agenda from "./Componentes/Agenda/Agenda.jsx"
import BuscaCliente from "./Componentes/BuscaCliente/buscaCliente.jsx"
import HistoricoSemanal from "./Componentes/Agenda/HistoricoSemanal.jsx"



function App() {
  
  const [ setIsAuthenticated] = useState(false);
  return (
    

   
    <Routes>
      <Route path="/"element= { <Login setIsAuthenticated={setIsAuthenticated}/> }/>;
      <Route path="/busca-cliente" element={<BuscaCliente />} />
      <Route path="/home" element = { <Home/> }/>
      <Route path="/cadastrar-cliente" element= { <CadastrarCliente/> }/>
      <Route path="/lista-clientes" element={ <ListaClientes/> } />
    
      <Route path="/editar-cliente/:id" element={ <EditarCliente/> }/>
      <Route path="/agenda" element= { <Agenda/> }/>
      <Route path="/historico-semanal" element= { <HistoricoSemanal/> }/>
      
  
    </Routes>
   
  )
}

export default App

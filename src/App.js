import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png'

function App() {

  // URI da API
  const baseUrl = "https://localhost:5001/api/alunos";

  // Estados
  //  Estado dos dados de alunos (lista)
  const [data, setData] = useState([]);
  //  Estado para dados de inclusão de aluno através do formulário na janela modal
  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  });
  //  Estado para exibição de janela modal de inclusão
  const [modalIncluir, setModalIncluir] = useState(false);

  // Método que guarda os dados do aluno informados nos inputs da janela modal,
  // e usa o método setAlunoSelecionado para atualizar o estado
  const handleChange = e => {
    const {name, value} = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado, [name]:value
    });
    console.log(alunoSelecionado);
  }

  // Método para abrir/fechar janela modal de inclusão
  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  // Enviando Request GET com o axios para a API
  // Obtendo lista de alunos da API
  const pedidoGet = async() => {
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  // Enviando Request POST com o axios para a API.
  // Incluindo aluno na API
  const pedidoPost = async() => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.post(baseUrl, alunoSelecionado)
    .then(response => {
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    }).catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    pedidoGet();
  });

  return (

    <div className="aluno-container">
      <br />
      <h3>Cadastro de Alunos</h3>
      <header className="App-header">
        <img src={logoCadastro} alt="Cadastro" />
        <button className="btn btn-success" onClick={()=>{abrirFecharModalIncluir()}}>Incluir novo Aluno</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button class="btn btn-primary">Editar</button> {" "}
                <button class="btn btn-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} />
            <label>Idade: </label>
            <br />
            <input type="text" className="form-control" name="idade" onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>{pedidoPost()}}>Incluir</button>{" "}
          <button className="btn btn-danger" onClick={()=>{abrirFecharModalIncluir()}}>Cancelar</button>
        </ModalFooter>
      </Modal>

    </div>

  );
}

export default App;

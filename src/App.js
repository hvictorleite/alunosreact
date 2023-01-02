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
  //  Estado para captar atualização nos dados
  const [updateData, setUpdateData] = useState(true);
  //  Estado para dados de inclusão de aluno através do formulário na janela modal
  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  });
  //  Estado para exibição de janela modal de inclusão
  const [modalIncluir, setModalIncluir] = useState(false);
  //  Estado para exibição de janela modal de edição
  const [modalEditar, setModalEditar] = useState(false);
  //  Estado para exibição de janela modal de exclusão
  const [modalExcluir, setModalExcluir] = useState(false);


  // Método que guarda os dados do aluno informados nos inputs das janelas modais,
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

  // Método para abrir/fechar janela modal de edição
  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  // Método para abrir/fechar janela modal de exclusão
  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  // Método para editar/excluir o aluno selecionado
  const selecionarAluno = (aluno, opcao) => {
	  setAlunoSelecionado(aluno);
	  (opcao==="Editar") ? abrirFecharModalEditar(): abrirFecharModalExcluir();
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
      setUpdateData(true);
      abrirFecharModalIncluir();
    }).catch(error => {
      console.log(error);
    });
  }

  // Enviando Request PUT com o axios para a API.
  // Editando aluno da API
  const pedidoPut = async() => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl+"/"+alunoSelecionado.id, alunoSelecionado)
    .then(response => {
      var resposta = response.data;
      var dadosAuxiliar = data;
      dadosAuxiliar.forEach(aluno => {
        if(aluno.id === alunoSelecionado.id){
          aluno.nome = resposta.nome;
          aluno.email = resposta.email;
          aluno.idade = resposta.idade;
        }
      });
      setUpdateData(true);
      abrirFecharModalEditar();
    }).catch(error => {
      console.log(error);
    });
  }

  // Enviando Request DELETE com o axios para a API.
  // Excluindo aluno da API
  const pedidoDelete = async() => {
    await axios.delete(baseUrl+"/"+alunoSelecionado.id)
    .then(response => {
      setData(data.filter(aluno => aluno.id !== response.data));
      setUpdateData(true);
      abrirFecharModalExcluir();
    }).catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    if(updateData){
      pedidoGet();
      setUpdateData(false);
    }
  },[updateData]);

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
                <button class="btn btn-primary" onClick={()=>{selecionarAluno(aluno, "Editar")}}>Editar</button> {" "}
                <button class="btn btn-danger" onClick={()=>{selecionarAluno(aluno, "Excluir")}}>Excluir</button>
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

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
          <label>ID: </label>
          <input type="text" className="form-control" readOnly
            value={alunoSelecionado && alunoSelecionado.id} />
          <br />
          <label>Nome: </label>
          <br />
          <input type="text" className="form-control" name="nome" onChange={handleChange}
            value={alunoSelecionado && alunoSelecionado.nome} />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="email" onChange={handleChange}
            value={alunoSelecionado && alunoSelecionado.email} />
          <label>Idade: </label>
          <br />
          <input type="text" className="form-control" name="idade" onChange={handleChange}
            value={alunoSelecionado && alunoSelecionado.idade} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>{pedidoPut()}}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={()=>{abrirFecharModalEditar()}}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          <p>Confirma a exclusão deste(a) aluno(a): {alunoSelecionado && alunoSelecionado.nome} ?</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>{pedidoDelete()}}>Sim</button>
          <button className="btn btn-secondary" onClick={()=>{abrirFecharModalExcluir()}}>Não</button>
        </ModalFooter>
      </Modal>

    </div>

  );
}

export default App;

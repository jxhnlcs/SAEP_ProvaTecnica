<template>
  <div class="box">
    <h2>Pátios</h2>
    <div v-for="setor in setoresUnicos" :key="setor.area" :class="['setor', setor.cor]" @click="abrirModal(setor)">
      {{ setor.area }}
    </div>
  </div>

  <div class="modal" v-if="modalVisivel">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <h2>Área {{ modalSetor.area }}</h2>
    <template v-if="modalSetor.veiculos.length > 0">
      <div class="tables">
      <table class="table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="veiculo in modalSetor.veiculos" :key="veiculo.modelo">
            <td>{{ veiculo.modelo }}</td>
            <td>{{ veiculo.preco }}</td>
            <td>{{ veiculo.quantidade }}</td>
            <td>
              <button class="btn-vender" @click="abrirModalVenda(veiculo)">Vender</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </template>
    <template v-else>
      <p>Não existem veículos aqui</p>
    </template>
    <h2 class="close-btn" @click="fecharModal">Fechar</h2>
  </div>
</div>


<div class="modal" v-if="modalVendaVisivel">
  <div class="modal-overlay"></div>
  <div class="modal-content modalvenda" @click.stop>
    <h2>Venda de Veículo</h2>
    <p>Modelo: {{ carroSelecionado.modelo }}</p>
    <p>Preço: R$ {{ carroSelecionado.preco }}</p>
    <label for="cliente">Cliente:</label>
    <select id="cliente" v-model="clienteSelecionado">
      <option value="">Selecione um cliente</option>
      <option v-for="cliente in clientes" :value="cliente.id">{{ cliente.clientes }}</option>
    </select>

    <label for="concessionaria">Concessionária:</label>
    <select id="concessionaria" v-model="concessionariaSelecionada">
      <option value="">Selecione uma concessionária</option>
      <option v-for="concessionaria in concessionarias" :value="concessionaria.id">{{ concessionaria.concessionaria }}</option>
    </select>
    <button class="btn-confirmar-venda" @click="confirmarVenda">Confirmar</button>
    <h2 class="close-btn" @click="fecharModalVenda">Fechar</h2>
  </div>
</div>

</template>

<script>
export default {
  data() {
    return {
      setores: [],
      modalVisivel: false,
      modalSetor: null,
      modalVendaVisivel: false,
      modalVendaVeiculo: null,
      clienteSelecionado: "",
      concessionariaSelecionada: "",
      clientes: [],
      concessionarias: [],
      carroSelecionado: null,
    };
  },
  computed: {
    setoresUnicos() {
      const areas = Array.from(new Set(this.setores.map(setor => setor.area)));
      areas.sort((a, b) => a - b);

      return areas.map(area => {
        const setor = this.setores.find(s => s.area === area);
        return {
          area: setor.area,
          cor: setor.cor,
          veiculos: [],
        };
      });
    },
  },
  mounted() {
    this.carregarSetores();
    this.carregarClientes();
    this.carregarConcessionarias();
  },
  methods: {
    carregarSetores() {
      fetch('http://localhost:3000/api/alocacao')
        .then(response => response.json())
        .then(data => {
          this.setores = data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    abrirModal(setor) {
      fetch(`http://localhost:3000/api/automoveis/${setor.area}`)
        .then(response => response.json())
        .then(data => {
          setor.veiculos = data;
          this.modalVisivel = true;
          this.modalSetor = setor;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fecharModal() {
      this.modalVisivel = false;
      this.modalSetor = null;
    },
    abrirModalVenda(veiculo) {
      this.modalVendaVisivel = true;
      this.modalVendaVeiculo = veiculo;
      this.carroSelecionado = veiculo;
    },

    fecharModalVenda() {
      this.modalVendaVisivel = false;
      this.modalVendaVeiculo = null;
    },

    confirmarVenda() {
      this.fecharModalVenda();
      this.fecharModal();
      if (this.clienteSelecionado && this.concessionariaSelecionada) {
        Swal.fire(
          'Vendido',
          'O veículo foi vendido com sucesso',
          'success'
        ).then(() =>{
          const automovelId = this.carroSelecionado.id;
          fetch(`http://localhost:3000/api/vendas/${automovelId}`,{
            method: 'PUT'
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.clienteSelecionado = "";
          this.concessionariaSelecionada = "";
          })
          .catch(error => {
            console.error("Erro ao atualizar a quantidade do automóvel:", error);
          });
        })
      } else {
        Swal.fire(
          'Erro!',
          'Selecione um cliente e uma concessionária antes de confirmar a venda',
          'error'
        )
      }
      
    },

    carregarClientes() {
      fetch('http://localhost:3000/api/clientes')
        .then(response => response.json())
        .then(data => {
          this.clientes = data;
        })
        .catch(error => {
          console.error(error);
        });
    },

    carregarConcessionarias() {
      fetch('http://localhost:3000/api/concessionaria')
        .then(response => response.json())
        .then(data => {
          this.concessionarias = data;
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
};
</script>

<style>
.box {
  width: 80%;
  margin-left: 100px;
}

.setor {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin: 5px;
  text-align: center;
  line-height: 50px;
  font-weight: bold;
  font-size: 30px;
  cursor: pointer;
  padding: 70px;
  border-radius: 15px;
}

.azul {
  background-color: rgb(41, 41, 196);
  color: white;
}

.branco {
  background-color: white;
  color: black;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  max-width: 90%; /* Define a largura máxima do modal */
  margin: 0 auto; /* Centraliza o modal horizontalmente */
  border-radius: 30px;
  background-color: white;
  padding: 30px;
  border: solid black 5px;
}

.modal-content h2,
.modal-content p {
  color: black;
  cursor: default;
}

.bodyFundo {
  background-color: black;
}

label {
  color: black;
}


select {
  padding: 15px;
  border-radius: 10px;
}

.modal-content p, label {
  font-weight: bold;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout:auto;
  font-family: Arial, sans-serif;
}

.table thead {
  background-color: #f5f5f5;
}

.table th,
.table td {
  padding: 6px 2px;
  text-align: center;
  cursor: default;
}

.table th {
  font-weight: bold;
  color: #333;
  cursor: default;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tbody tr:hover {
  background-color: #eaf6ff;
}

.btn-vender {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #7814FF;
  color: white;
  cursor: pointer;
}

.btn-vender:hover {
  background-color: #5e0ec7d0;
  transition: 0.5s;
}

.close-btn {
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #555;
  cursor: pointer;
  margin-top: 16px;
}

.close-btn:hover {
  background-color: #ddd;
}

.modal-content.modalvenda {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.modal-content.modalvenda h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  cursor: default;
}

.modal-content.modalvenda p {
  cursor: default;
  margin-bottom: 10px;
  color: #555;
}

.modal-content.modalvenda label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
}

.modal-content.modalvenda select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #555;
  margin-bottom: 20px;
}

.modal-content.modalvenda .btn-confirmar-venda {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background-color: #7814FF;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: 0.5s;
}

.modal-content.modalvenda .btn-confirmar-venda:hover {
  background-color: #5e3199c5;
}

.modal-content.modalvenda .close-btn {
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #555;
  cursor: pointer;
  margin-top: 20px;
}

.modal-content.modalvenda .close-btn:hover {
  background-color: #ddd;
}

thead tr th {
  color: black;
}

tbody tr td {
  color: black;
}


@media only screen and (max-width: 600px) {
  .box {
    margin-left: 0px;
    width: 100%;
  }

  .table{
    table-layout: fixed;
  }
  
}
</style>

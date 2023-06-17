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
      <ul>
        <li v-for="veiculo in modalSetor.veiculos" :key="veiculo.modelo">
          {{ veiculo.modelo }} - R$ {{ veiculo.preco }}
          <button @click="abrirModalVenda(veiculo)">Vender</button>
        </li>
      </ul>
      <h2 class="x" @click="fecharModal">Fechar</h2>
    </div>
  </div>

  <div class="modal" v-if="modalVendaVisivel">
    <div class="modal-overlay"></div>
    <div class="modal-content modalvenda" @click.stop>
      <h2>Venda de Veículo</h2>
      <p>Modelo: {{ modalVendaVeiculo.modelo }}</p>
      <p>Preço: R$ {{ modalVendaVeiculo.preco }}</p>
      <label for="cliente">Cliente:</label>
      <select id="cliente" v-model="clienteSelecionado">
      <option value="">Selecione um cliente</option>
      <option v-for="cliente in clientes" :value="cliente.id">{{ cliente.clientes }}</option>
      <!-- Adicione outras opções de cliente aqui -->
    </select>

    <label for="concessionaria">Concessionária:</label>
    <select id="concessionaria" v-model="concessionariaSelecionada">
      <option value="">Selecione uma concessionária</option>
      <option v-for="concessionaria in concessionarias" :value="concessionaria.id">{{ concessionaria.concessionaria }}</option>
      <!-- Adicione outras opções de concessionária aqui -->
    </select>
    <button class="confirmavenda" @click="confirmarVenda">Confirmar</button>
    <h2 class="x" @click="fecharModalVenda">Fechar</h2>
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
      concessionarias: []
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
    },

    fecharModalVenda() {
      this.modalVendaVisivel = false;
      this.modalVendaVeiculo = null;
    },

    confirmarVenda() {
      if (this.clienteSelecionado && this.concessionariaSelecionada) {
        alert("Veículo vendido!");
      } else {
        alert("Selecione um cliente e uma concessionária antes de confirmar a venda.");
      }
      this.fecharModalVenda();
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
  cursor: pointer;
  padding: 70px;
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
  border-radius: 30px;
  background-color: white;
  padding: 50px;
  border: solid black 5px;
}

.modal-content h2,
.modal-content p {
  color: black;
}

.bodyFundo {
  background-color: black;
}
ul{
  margin-left: -70px;
}
li{
  color: black;
  list-style: none;
  text-align: justify;
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
}

label{
  color: black;
}

.modalvenda{
  display: flex;
  flex-direction: column;
}

select{
  padding: 15px;
  border-radius: 10px;
}

.confirmavenda{
  border: solid 2px black;
  background-color: blue;
  margin-top: 20px;
}

.x{
  font-size: 20px;
  border: solid black 2px;
  width: 40%;
  padding: 10px 30px;
  border-radius: 20px;
  background-color: red;
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .box{
    margin-left: 0px;
  }
  .modal-content{
    width: 60%;
    margin-right: 20px;
  }
}
</style>

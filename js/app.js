class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {

        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}
class Bd {
    constructor() {

        let id = localStorage.getItem('id')

        if(id === null ){
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let ProximoId = localStorage.getItem('id')
        return parseInt(ProximoId) + 1
    }
    gravar(d) {

        
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    
    }
    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')

        for(let i = 1; i<= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)

        }
        return despesas
    }
    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){

            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){

            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){

            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.tipo != ''){

            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.descricao != ''){

            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.valor != ''){

            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasFiltradas

    }
    remover(id){
		localStorage.removeItem(id)
	}
}
    let bd  = new Bd
function cadastrarDespesa() {
   let ano = document.getElementById('ano')
   let mes = document.getElementById('mes')
   let dia = document.getElementById('dia')
   let tipo = document.getElementById('tipo')
   let descricao = document.getElementById('descricao')
   let valor = document.getElementById('valor')

   let despesa = new Despesa (
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    if(despesa.validarDados()){
            document.getElementById('TituloAlerta').innerHTML = 'Despesa Cadastrada com Sucesso!'
            document.getElementById('IconeAlerta').innerHTML = '<i class="fa-regular fa-circle-check iconealerta"></i>'
            document.getElementById('TextoAlerta').innerHTML = 'Cadastro Realizado, Para Consultar use a aba Consulta!'
            
        const toastTrigger = document.getElementById('btncad')
        const toastLiveExample = document.getElementById('liveToast')
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()

        
        bd.gravar(despesa)

        
		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
    }
    else{
            document.getElementById('TituloAlerta').innerHTML = 'Faltam Dados a serem Preenchidos!'
            document.getElementById('IconeAlerta').innerHTML = '<i class="fa-solid fa-circle-exclamation iconealerta"></i>'
            document.getElementById('TextoAlerta').innerHTML = 'Não pode haver nenhum campo vazio!'

        const toastTrigger = document.getElementById('btncad')
        const toastLiveExample = document.getElementById('liveToast')
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
 

    }
    
}

function carregarListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() 
	}
	
	/*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

	let listaDespesas = document.getElementById("listaDespesas")
    let somaTotal = document.getElementById("SomarDespesas")

	despesas.forEach(function(d){

		//Criando a linha (tr)
		let linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
            linha.setAttribute('class', 'alimentacao-classe');
				break
			case '2': d.tipo = 'Educação'
            linha.setAttribute('class', 'educacao-classe');
				break
			case '3': d.tipo = 'Lazer'
            linha.setAttribute('class', 'lazer-classe');

				break
			case '4': d.tipo = 'Saúde'
            linha.setAttribute('class', 'saude-classe');

				break
			case '5': d.tipo = 'Pet'
            linha.setAttribute('class', 'pet-classe');

				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = `$ ${d.valor}`

        //Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)});     

	}
 function pesquisarDespesa() {
        let ano = document.getElementById('ano').value
        let mes = document.getElementById('mes').value
        let dia = document.getElementById('dia').value
        let tipo = document.getElementById('tipo').value
        let descricao = document.getElementById('descricao').value
        let valor = document.getElementById('valor').value

        let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

        let despesas = bd.pesquisar(despesa)

        let listaDespesas = document.getElementById("listaDespesas")
        listaDespesas.innerHTML = ''
        despesas.forEach(function(d) {
    
            //Criando a linha (tr)
            let linha = listaDespesas.insertRow()
            
            
            //Criando as colunas (td)
            linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
    
            //Ajustar o tipo
            switch(d.tipo){
                case '1': d.tipo = 'Alimentação'
                linha.setAttribute('class', 'alimentacao-classe');
                    break
                case '2': d.tipo = 'Educação'
                linha.setAttribute('class', 'educacao-classe');
                    break
                case '3': d.tipo = 'Lazer'
                linha.setAttribute('class', 'lazer-classe');

                    break
                case '4': d.tipo = 'Saúde'
                linha.setAttribute('class', 'saude-classe');

                    break
                case '5': d.tipo = 'Pet'
                linha.setAttribute('class', 'pet-classe');

                    break
                
            }
            linha.insertCell(1).innerHTML = d.tipo
            linha.insertCell(2).innerHTML = d.descricao
            linha.insertCell(3).innerHTML = `$ ${d.valor}`
            //Criar o botão de exclusão
let btn = document.createElement('button')
btn.className = 'btn btn-danger'
btn.innerHTML = '<i class="fa fa-times"  ></i>'
btn.id = `id_despesa_${d.id}`
btn.onclick = function(){
    let id = this.id.replace('id_despesa_','')
    //alert(id)
    bd.remover(id)
    window.location.reload()
}
linha.insertCell(4).append(btn)



})
    }

/* ==========================================================================
   LÓGICA DE NEGÓCIO E VALIDAÇÃO - MIP DIGITAL
   Focado em Engenharia de Software, Validação Estrita e Experiência do Usuário (UX)
   ========================================================================== */

// 1. Captura dos elementos do DOM usando document.querySelector (Diretriz Obrigatória)
const formMip = document.querySelector('#form-mip');
const inputArea = document.querySelector('#area-lavoura');
const inputCusto = document.querySelector('#custo-aplicacao');
const selectCultura = document.querySelector('#tipo-cultura');

// Elementos de Feedback Visual (Injeção na Tela)
const containerErro = document.querySelector('#container-erro');
const artigoResultado = document.querySelector('#resultado-calculo');

// Elementos internos dos cards de resultado
const resAplicacoes = document.querySelector('#res-aplicacoes');
const resEconomia = document.querySelector('#res-economia');
const resImpacto = document.querySelector('#res-impacto');

// 2. Escutador de Eventos (Event Listener) para interceptar o envio do formulário
formMip.addEventListener('submit', function(event) {
    // Impede o comportamento padrão de recarregar a página ao enviar o formulário
    event.preventDefault();

    // Reset inicial do estado dos containers de feedback
    ocultarErro();
    artigoResultado.hidden = true;

    // 3. CAPTURA E CONVERSÃO DOS DADOS DE ENTRADA
    const area = parseFloat(inputArea.value);
    const custo = parseFloat(inputCusto.value);
    const cultura = selectCultura.value;

    // 4. VALIDAÇÃO ESTRITA DE DADOS (Prevenção de Bugs e Entrada Inválida)
    let mensagensErro = [];

    // Validação de campos vazios ou não numéricos (NaN)
    if (isNaN(area) || isNaN(custo) || cultura === "") {
        mensagensErro.push("Por favor, preencha todos os campos do formulário para realizar a simulação.");
    }

    // Validação de valores negativos ou zerados (Inconsistência matemática no campo)
    if (!isNaN(area) && area <= 0) {
        mensagensErro.push("A área da lavoura deve ser um número maior do que zero.");
    }
    if (!isNaN(custo) && custo <= 0) {
        mensagensErro.push("O custo estimado por aplicação deve ser um valor maior do que zero.");
    }

    // Se houver algum erro coletado, renderiza o aviso amigável na tela e interrompe a execução
    if (mensagensErro.length > 0) {
        exibirErro(mensagensErro.join("<br>"));
        return; // Interrompe o script (Early Return) impedindo cálculos errôneos
    }

    // 5. PROCESSAMENTO DOS DADOS (Regras de negócio baseadas nos manuais SENAR-PR)
    /* Premissa Técnica do MIP: A adoção do monitoramento de pragas reduz, em média, 
       2 aplicações químicas desnecessárias por safra em comparação ao calendário tradicional.
    */
    const aplicacoesPoupadas = 2;
    const economiaPorHectare = aplicacoesPoupadas * custo;
    const economiaTotal = economiaPorHectare * area;

    // Definição do impacto ambiental/ESG com base na cultura selecionada
    let textoImpactoESG = "";
    if (cultura === "soja") {
        textoImpactoESG = "Redução na pulverização contra Ferrugem Asiática e Percevejos. Preservação de polinizadores e inimigos naturais.";
    } else if (cultura === "milho") {
        textoImpactoESG = "Controle biológico estratégico da Cigarrinha. Redução do risco de resistência de pragas aos ativos químicos.";
    } else if (cultura === "morango") {
        textoImpactoESG = "Manejo focado em biológicos contra Ácaro-rajado. Alimento mais seguro e governança ambiental (ESG) consolidada.";
    }

    // 6. RENDERIZAÇÃO ELEGANTE DOS RESULTADOS DIRETAMENTE NA PÁGINA
    // Formatação de valores para a moeda local (Real - R$)
    const economiaFormatada = economiaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    resAplicacoes.

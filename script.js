document.addEventListener(&#39;DOMContentLoaded&#39;, function () {
  // Utilitário para formatar moeda (R$)
  function moedaBR(valor) {
    return new Intl.NumberFormat(&#39;pt-BR&#39;, { style: &#39;currency&#39;, currency:
&#39;BRL&#39; }).format(valor);
  }
  // normaliza entrada (troca vírgula por ponto e converte para número)
  function toNumber(val) {
    if (typeof val === &#39;number&#39;) return val;
    if (!val &amp;&amp; val !== 0) return NaN;
    return parseFloat(String(val).trim().replace(&#39;,&#39;, &#39;.&#39;));
  }
  const form = document.getElementById(&#39;form&#39;);
  const erro = document.getElementById(&#39;erro&#39;);
  const resultados = document.getElementById(&#39;resultados&#39;);
  const tabelaSecao = document.getElementById(&#39;tabelaSecao&#39;);
  const outPrecoComDesconto =
document.getElementById(&#39;precoComDesconto&#39;);

  const outValorParcela = document.getElementById(&#39;valorParcela&#39;);
  const outTotalPagar = document.getElementById(&#39;totalPagar&#39;);
  const outEconomia = document.getElementById(&#39;economia&#39;);
  if (!form) {
    console.error(&#39;form não encontrado (id=&quot;form&quot;). Verifique o HTML.&#39;);
    return;
  }
  form.addEventListener(&#39;submit&#39;, function (e) {
    e.preventDefault();
    erro.textContent = &#39;&#39;;
    try {
      // Ler entradas (aceita vírgula em números)
      const preco = toNumber(document.getElementById(&#39;preco&#39;).value);
      const desconto =
toNumber(document.getElementById(&#39;desconto&#39;).value);
      const taxa = toNumber(document.getElementById(&#39;taxa&#39;).value);
      const parcelasRaw = document.getElementById(&#39;parcelas&#39;).value;
      const parcelas = parseInt(String(parcelasRaw).replace(&#39;,&#39;, &#39;&#39;),
10);
      // Validações
      if (isNaN(preco) || preco &lt;= 0) throw new Error(&#39;Informe um preço
válido (&gt; 0).&#39;);
      if (isNaN(desconto) || desconto &lt; 0) throw new Error(&#39;Desconto deve
ser ≥ 0.&#39;);
      if (isNaN(taxa) || taxa &lt; 0) throw new Error(&#39;Taxa deve ser ≥ 0.&#39;);
      if (isNaN(parcelas) || parcelas &lt; 1) throw new Error(&#39;Número de
parcelas deve ser ≥ 1.&#39;);
      // Cálculos
      const precoComDesconto = preco * (1 - desconto / 100);
      const i = taxa / 100; // taxa decimal ao mês
      const J_total = precoComDesconto * i * parcelas; // juros simples
total
      const totalPagar = precoComDesconto + J_total;
      const valorParcela = totalPagar / parcelas;
      const economia = preco - precoComDesconto;
      // Exibir resultados principais
      outPrecoComDesconto.textContent = moedaBR(precoComDesconto);
      outValorParcela.textContent = moedaBR(valorParcela);
      outTotalPagar.textContent = moedaBR(totalPagar);
      outEconomia.textContent = moedaBR(economia);
      resultados.hidden = false;
      // Montar/garantir tbody

      let corpoTabela = document.querySelector(&#39;#tabela tbody&#39;);
      if (!corpoTabela) {
        const tabela = document.getElementById(&#39;tabela&#39;);
        corpoTabela = document.createElement(&#39;tbody&#39;);
        tabela.appendChild(corpoTabela);
      }
      corpoTabela.innerHTML = &#39;&#39;;
      const jurosMesConstante = precoComDesconto * i; // juros do mês
constante
      const amortizacaoConstante = precoComDesconto / parcelas; //
amortização constante
      for (let mes = 1; mes &lt;= parcelas; mes++) {
        // evitar pequenas diferenças de arredondamento no último mês
        const principalRestante = Math.max(0, precoComDesconto -
amortizacaoConstante * mes);
        const tr = document.createElement(&#39;tr&#39;);
        const tdMes = document.createElement(&#39;td&#39;);
        tdMes.textContent = mes;
        const tdParcela = document.createElement(&#39;td&#39;);
        tdParcela.textContent = moedaBR(valorParcela);
        const tdJurosMes = document.createElement(&#39;td&#39;);
        tdJurosMes.textContent = moedaBR(jurosMesConstante);
        const tdAmortizacao = document.createElement(&#39;td&#39;);
        tdAmortizacao.textContent = moedaBR(amortizacaoConstante);
        const tdRestante = document.createElement(&#39;td&#39;);
        tdRestante.textContent = moedaBR(principalRestante);
        // Usa appendChild (mais compatível que append com múltiplos
args)
        tr.appendChild(tdMes);
        tr.appendChild(tdParcela);
        tr.appendChild(tdJurosMes);
        tr.appendChild(tdAmortizacao);
        tr.appendChild(tdRestante);
        corpoTabela.appendChild(tr);
      }
      tabelaSecao.hidden = false;
    } catch (err) {

      console.error(err);
      erro.textContent = err.message || &#39;Ocorreu um erro — abra o Console
(F12) para ver detalhes.&#39;;
      resultados.hidden = true;
      tabelaSecao.hidden = true;
    }
  });
});
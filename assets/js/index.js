const selectDiv = document.getElementById("currency");
const btnConverter = document.getElementById("convertButton");
const resultDiv = document.getElementById("result");
let chart = null;

//Llenar Select
const populateSelect = () => {
  const currencies = ["dolar", "euro", "uf"];
  currencies.forEach((currency) => {
    const option = document.createElement("option");
    option.value = currency;
    option.textContent = currency.toUpperCase();
    selectDiv.appendChild(option);
  });
};

populateSelect();

//obtener data de API
const getData = async () => {
  try {
    const result = await fetch(`https://mindicador.cl/api/${selectDiv.value}`);
    if (!result) throw new Error("Ocurrió un error en la solicitud");

    const data = await result.json();

    //Calcular conversion
    const inputAmount = document.getElementById("amount").value;

    if (!inputAmount) {
      alert("Ingresa un monto válido");
      return;
    }

    const valorMoneda = data.serie[0].valor;

    const resultado = inputAmount / valorMoneda;

    resultDiv.innerHTML = `Resultado: $${resultado.toFixed(2)}`;

    // console.log(valorMoneda);

    createLineChart(data.serie, data.nombre);
  } catch (err) {
    console.log(err);
  }
};

//AddevenetListener del boton
btnConverter.addEventListener("click", () => {
  getData();
});

//Crear el grafico
const createLineChart = (data, moneda) => {
  const ctx = document.getElementById("myChart").getContext("2d");

  const days = data.map((day) => new Date(day.fecha).toLocaleDateString());
  const values = data.map((value) => value.valor);
  console.log(data);

  if (chart !== null) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: `Valor del ${moneda} (CLP)`,
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

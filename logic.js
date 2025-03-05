    // Configuración de las puertas lógicas
    const gates = {
      AND: {
        title: "Puerta Lógica AND",
        image: "img/and.png",
        operation: "A^B",
        calculate: (a, b) => a && b,
        truthTable: {
          "00": 0,
          "01": 0,
          "10": 0,
          "11": 1
        }
      },
      OR: {
        title: "Puerta Lógica OR",
        image: "img/or.png",
        operation: "A+B",
        calculate: (a, b) => a || b,
        truthTable: {
          "00": 0,
          "01": 1,
          "10": 1,
          "11": 1
        }
      },
      NOT: {
        title: "Puerta Lógica NOT",
        image: "img/not.png",
        operation: "¬A",
        calculate: (a) => !a,
        truthTable: {
          "0": 1,
          "1": 0
        },
        singleInput: true
      },
      NAND: {
        title: "Puerta Lógica NAND",
        image: "img/nand.png",
        operation: "¬(A^B)",
        calculate: (a, b) => !(a && b),
        truthTable: {
          "00": 1,
          "01": 1,
          "10": 1,
          "11": 0
        }
      },
      NOR: {
        title: "Puerta Lógica NOR",
        image: "img/nor.png",
        operation: "¬(A+B)",
        calculate: (a, b) => !(a || b),
        truthTable: {
          "00": 1,
          "01": 0,
          "10": 0,
          "11": 0
        }
      },
      XOR: {
        title: "Puerta Lógica XOR",
        image: "img/xor.png",
        operation: "A⊕B",
        calculate: (a, b) => (a || b) && !(a && b),
        truthTable: {
          "00": 0,
          "01": 1,
          "10": 1,
          "11": 0
        }
      },
      XNOR: {
        title: "Puerta Lógica XNOR",
        image: "img/xnor.png",
        operation: "¬(A⊕B)",
        calculate: (a, b) => !((a || b) && !(a && b)),
        truthTable: {
          "00": 1,
          "01": 0,
          "10": 0,
          "11": 1
        }
      }
    };

    let currentGate = gates.AND;

    function updateCheckboxLabel(checkbox) {
      const checkboxLabel = checkbox.parentElement;
      if (checkbox.checked) {
        checkboxLabel.querySelector('span').textContent = '1';
        checkboxLabel.classList.remove('unchecked');
        checkboxLabel.classList.add('checked');
      } else {
        checkboxLabel.querySelector('span').textContent = '0';
        checkboxLabel.classList.remove('checked');
        checkboxLabel.classList.add('unchecked');
      }
    }

    function calculateResult() {
      const checkboxes = document.querySelectorAll('.checkbox');
      let values = '';
      
      // Obtener los valores de los checkboxes
      const inputs = Array.from(checkboxes).map(checkbox => {
        const isChecked = checkbox.checked;
        values += isChecked ? '1' : '0';
        return isChecked;
      });
      
      // Calcular el resultado basado en la puerta actual
      let result;
      if (currentGate.singleInput) {
        result = currentGate.calculate(inputs[0]) ? 1 : 0;
      } else {
        result = currentGate.calculate(inputs[0], inputs[1]) ? 1 : 0;
      }
      
      // Actualizar la visualización del resultado
      const resultLabel = document.getElementById('result');
      resultLabel.textContent = result;
      if (result === 1) {
        resultLabel.classList.add('true');
      } else {
        resultLabel.classList.remove('true');
      }
      
      highlightTruthTableRow(values);
    }

    function highlightTruthTableRow(values) {
      document.querySelectorAll('.truth-table tbody tr').forEach(row => {
        if (row.getAttribute('data-values') === values) {
          row.classList.add('highlight');
        } else {
          row.classList.remove('highlight');
        }
      });
    }

    function updateGateUI(gateName) {
      currentGate = gates[gateName];
      
      // Actualizar el título
      document.getElementById('gateTitle').textContent = currentGate.title;
      
      // Actualizar la imagen
      const gateImage = document.getElementById('gateImage');
      gateImage.src = currentGate.image;
      gateImage.alt = "Diagrama de la " + currentGate.title;
      
      // Actualizar el encabezado de la tabla de verdad
      document.getElementById('operationHeader').textContent = currentGate.operation;
      
      // Actualizar los resultados en la tabla de verdad
      for (const [combination, result] of Object.entries(currentGate.truthTable)) {
        const resultCell = document.getElementById('result' + combination);
        if (resultCell) {
          resultCell.textContent = result;
          resultCell.className = result === 1 ? 'true' : 'false';
        }
      }
      
      // Mostrar/ocultar controles de entrada según el tipo de puerta
      const checkboxContainer = document.getElementById('checkboxContainer');
      if (currentGate.singleInput) {
        // Para puertas con una sola entrada (NOT)
        checkboxContainer.querySelector('label:nth-child(2)').style.display = 'none';
      } else {
        // Para puertas con dos entradas
        checkboxContainer.querySelector('label:nth-child(2)').style.display = 'block';
      }
      
      // Actualizar la tabla de verdad según el tipo de puerta
      const truthTable = document.getElementById('truthTable');
      if (currentGate.singleInput) {
        // Para puertas con una sola entrada (NOT), ocultar la tabla completamente
        truthTable.style.display = 'none';
      } else {
        // Para puertas con dos entradas, mostrar la tabla
        truthTable.style.display = 'table';
      }
      
      // Recalcular el resultado con los valores actuales
      calculateResult();
    }

    // Configuración de los event listeners
    document.getElementById('checkboxContainer').addEventListener('click', function(event) {
      if (event.target.tagName === 'LABEL' && event.target.classList.contains('checkbox-label')) {
        const checkbox = event.target.querySelector('.checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      }
    });

    document.querySelectorAll('.checkbox').forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        updateCheckboxLabel(checkbox);
        calculateResult();
      });
    });
    
    // Event listener para el selector de puertas
    document.getElementById('gateSelector').addEventListener('change', function(event) {
      updateGateUI(event.target.value);
    });

    // Inicializar la UI
    document.addEventListener('DOMContentLoaded', function() {
      updateGateUI('AND');
    });
function updateInputs() {
    const numCharts = parseInt(document.getElementById('num-charts').value, 10);
    const chartsInputs = document.getElementById('charts-inputs');
    chartsInputs.innerHTML = ''; // Clear existing inputs

    for (let i = 0; i < numCharts; i++) {
        const container = document.createElement('div');
        container.className = 'chart-input-container';
        container.innerHTML = `
            <h3>Chart ${i + 1}</h3>
            <label for="labels-${i}">Enter Labels (comma-separated):</label>
            <input type="text" id="labels-${i}" placeholder="e.g., January, February, March">

            <label for="data-${i}">Enter Data (comma-separated):</label>
            <input type="text" id="data-${i}" placeholder="e.g., 1200, 1900, 3000">

            <label for="title-${i}">Enter Chart Title:</label>
            <input type="text" id="title-${i}" placeholder="Enter chart title">
        `;
        chartsInputs.appendChild(container);
    }
}

function updateCharts() {
    const numCharts = parseInt(document.getElementById('num-charts').value, 10);
    const chartType = document.getElementById('chart-type').value;

    // Clear existing charts
    const chartsSection = document.getElementById('charts-section');
    chartsSection.innerHTML = '';

    for (let i = 0; i < numCharts; i++) {
        const labels = document.getElementById(`labels-${i}`).value.split(',').map(label => label.trim());
        const data = document.getElementById(`data-${i}`).value.split(',').map(value => parseFloat(value.trim()));
        const title = document.getElementById(`title-${i}`).value;

        // Validate inputs
        if (labels.length !== data.length || labels.length === 0 || data.length === 0) {
            alert(`Please ensure that labels and data for Chart ${i + 1} are provided and match in length.`);
            return;
        }

        const chartId = `chart${i + 1}`;
        const container = document.createElement('div');
        container.className = 'chart-container';
        container.innerHTML = `<h2>${title || `Chart ${i + 1}`}</h2><canvas id="${chartId}"></canvas>`;
        chartsSection.appendChild(container);

        const ctx = document.getElementById(chartId).getContext('2d');

        new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: title || 'Dataset',
                    data: data,
                    backgroundColor: chartType === 'pie' || chartType === 'doughnut' ? generateColors(data.length) : 'rgba(75, 192, 192, 0.2)',
                    borderColor: chartType === 'pie' || chartType === 'doughnut' ? [] : 'rgba(75, 192, 192, 1)',
                    borderWidth: chartType === 'pie' || chartType === 'doughnut' ? 0 : 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                },
                scales: chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar' ? {} : {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const numCharts = jsonData.length;
        document.getElementById('num-charts').value = numCharts;
        updateInputs();

        jsonData.forEach((row, index) => {
            if (index < numCharts) {
                const [labels, data] = row;
                const labelsInput = document.getElementById(`labels-${index}`);
                const dataInput = document.getElementById(`data-${index}`);

                labelsInput.value = labels.join(',');
                dataInput.value = data.join(',');
            }
        });
    };

    reader.readAsArrayBuffer(file);
}

// Event listeners
document.getElementById('num-charts').addEventListener('input', updateInputs);
document.getElementById('upload-file').addEventListener('change', handleFileUpload);

// Initialize form inputs
updateInputs();

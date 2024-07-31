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

// Generate random colors for pie and doughnut chart segments
function generateColors(num) {
    const colors = [];
    for (let i = 0; i < num; i++) {
        colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`);
    }
    return colors;
}

// Update inputs when the number of charts changes
document.getElementById('num-charts').addEventListener('input', updateInputs);

// Initialize form inputs
updateInputs();

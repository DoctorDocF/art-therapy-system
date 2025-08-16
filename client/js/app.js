const API_URL = 'https://your-api-domain.com/api';

async function loadPatients() {
    const response = await fetch(`${API_URL}/patients`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.json();
}

async function updateStats() {
    const data = await loadPatients();
    renderChart(data);
}

function renderChart(data) {
    const ctx = document.getElementById('therapyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Делстриго', 'Биктарви', 'Тивикай'],
            datasets: [{
                label: 'Назначения за месяц',
                data: calculateDrugStats(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ]
            }]
        }
    });
}
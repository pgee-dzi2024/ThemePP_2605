 let sentimentChart = null;

const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const submitBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const loadingBox = document.getElementById('loading-box');
const errorBox = document.getElementById('error-box');
const resultSection = document.getElementById('result-section');

textInput.addEventListener('input', () => {
    charCount.textContent = `${textInput.value.length} / 4000`;
});

clearBtn.addEventListener('click', () => {
    textInput.value = '';
    charCount.textContent = '0 / 4000';
    errorBox.style.display = 'none';
    resultSection.style.display = 'none';
});

document.getElementById('analyze-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const text = textInput.value.trim();

    if (!text) {
        showError('Моля, въведете текст за анализ.');
        return;
    }

    submitBtn.disabled = true;
    loadingBox.style.display = 'block';
    errorBox.style.display = 'none';

    try {
        const response = await fetch('/api/analyze/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Възникна грешка при анализа.');
        }

        renderResult(data);
    } catch (error) {
        showError(error.message);
    } finally {
        submitBtn.disabled = false;
        loadingBox.style.display = 'none';
    }
});

function showError(message) {
    errorBox.textContent = message;
    errorBox.style.display = 'block';
}

function renderResult(data) {
    const sentiment = data.sentiment || 'neutral';
    const scores = data.scores || { positive: 0, neutral: 0, negative: 0 };

    resultSection.style.display = 'block';

    document.getElementById('analysis-id').textContent = data.id ?? '---';
    document.getElementById('pos-score').textContent = formatScore(scores.positive);
    document.getElementById('neu-score').textContent = formatScore(scores.neutral);
    document.getElementById('neg-score').textContent = formatScore(scores.negative);
    document.getElementById('clean-text').textContent = data.clean_text || '---';
    document.getElementById('last-sentiment').textContent = getSentimentLabel(sentiment);

    const badge = document.getElementById('sentiment-badge');
    badge.className = 'result-badge ' + getBadgeClass(sentiment);
    badge.innerHTML = getBadgeIcon(sentiment) + `<span>${getSentimentLabel(sentiment)}</span>`;

    updateChart(scores.positive || 0, scores.neutral || 0, scores.negative || 0);
}

function formatScore(value) {
    return Number(value || 0).toFixed(2);
}

function getSentimentLabel(sentiment) {
    if (sentiment === 'positive') return 'Позитивен';
    if (sentiment === 'negative') return 'Негативен';
    return 'Неутрален';
}

function getBadgeClass(sentiment) {
    if (sentiment === 'positive') return 'result-positive';
    if (sentiment === 'negative') return 'result-negative';
    return 'result-neutral';
}

function getBadgeIcon(sentiment) {
    if (sentiment === 'positive') return '<i class="fa fa-smile-o"></i>';
    if (sentiment === 'negative') return '<i class="fa fa-frown-o"></i>';
    return '<i class="fa fa-minus-circle"></i>';
}

function updateChart(pos, neu, neg) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');

    if (sentimentChart) {
        sentimentChart.destroy();
    }

    sentimentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Позитивен', 'Неутрален', 'Негативен'],
            datasets: [{
                label: 'Вероятност',
                data: [pos, neu, neg],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.75)',
                    'rgba(148, 163, 184, 0.75)',
                    'rgba(239, 68, 68, 0.75)'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(148, 163, 184, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e5e7eb'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#e5e7eb' },
                    grid: { color: 'rgba(255,255,255,0.08)' }
                },
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: { color: '#e5e7eb' },
                    grid: { color: 'rgba(255,255,255,0.08)' }
                }
            }
        }
    });
}

let sentimentChart = null;

const { createApp } = Vue;

createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            view: 'input',
            text: '',
            charCount: 0,
            loading: false,
            errorMessage: '',
            result: null,
            sentimentChart: null
        };
    },
    computed: {
        lastSentimentLabel() {
            if (!this.result) {
                return '---';
            }
            return this.getSentimentLabel(this.result.sentiment);
        },
        cleanText() {
            return this.result?.clean_text || '---';
        }
    },
    mounted() {
        this.updateCharCount();
    },
    beforeUnmount() {
        this.destroyChart();
    },
    methods: {
        updateCharCount() {
            this.charCount = this.text.length;
        },

        clearForm() {
            this.text = '';
            this.charCount = 0;
            this.errorMessage = '';
            this.result = null;
            this.view = 'input';
            this.destroyChart();
        },

        backToInput() {
            this.view = 'input';
            this.destroyChart();
        },

        async analyzeText() {
            const text = this.text.trim();

            if (!text) {
                this.errorMessage = 'Моля, въведете текст за анализ.';
                return;
            }

            this.loading = true;
            this.errorMessage = '';

            try {
                const csrfTokenEl = document.querySelector('[name=csrfmiddlewaretoken]');
                const csrfToken = csrfTokenEl ? csrfTokenEl.value : '';

                const response = await axios.post(
                    '/api/analyze/',
                    { text },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfToken
                        }
                    }
                );

                this.result = response.data;
                this.view = 'result';

                this.$nextTick(() => {
                    this.updateChart();
                });
            } catch (error) {
                this.errorMessage =
                    error?.response?.data?.detail ||
                    error?.response?.data?.message ||
                    error?.message ||
                    'Възникна грешка при анализа.';
            } finally {
                this.loading = false;
            }
        },

        formatScore(value) {
            return Number(value || 0).toFixed(2);
        },

        formatAnalysisTime(ms) {
            const value = Number(ms || 0);

            if (!value) {
                return '---';
            }

            if (value < 1000) {
                return `${value.toFixed(2)} ms`;
            }

            return `${(value / 1000).toFixed(2)} s`;
        },

        getSentimentLabel(sentiment) {
            if (sentiment === 'positive') return 'Позитивен';
            if (sentiment === 'negative') return 'Негативен';
            return 'Неутрален';
        },

        getBadgeClass(sentiment) {
            if (sentiment === 'positive') return 'result-positive';
            if (sentiment === 'negative') return 'result-negative';
            return 'result-neutral';
        },

        getBadgeIcon(sentiment) {
            if (sentiment === 'positive') return 'fa fa-smile-o';
            if (sentiment === 'negative') return 'fa fa-frown-o';
            return 'fa fa-minus-circle';
        },

        destroyChart() {
            if (this.sentimentChart) {
                this.sentimentChart.destroy();
                this.sentimentChart = null;
            }
        },

        updateChart() {
            const scores = this.result?.scores || {
                positive: 0,
                neutral: 0,
                negative: 0
            };

            const canvas = this.$refs.chartCanvas;
            if (!canvas) {
                return;
            }

            const ctx = canvas.getContext('2d');
            this.destroyChart();

            this.sentimentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Позитивен', 'Неутрален', 'Негативен'],
                    datasets: [{
                        label: 'Вероятност',
                        data: [
                            scores.positive || 0,
                            scores.neutral || 0,
                            scores.negative || 0
                        ],
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
                                color: '#393737'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#0554f3' },
                            grid: { color: 'rgba(255,255,255,0.08)' }
                        },
                        y: {
                            beginAtZero: true,
                            max: 1,
                            ticks: { color: '#047bf3' },
                            grid: { color: 'rgba(255,255,255,0.08)' }
                        }
                    }
                }
            });
        }
    }
}).mount('#app');
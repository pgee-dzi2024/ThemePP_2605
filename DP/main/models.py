from django.db import models


class ReviewAnalysis(models.Model):
    SENTIMENT_CHOICES = [
        ('positive', 'Позитивен'),
        ('neutral', 'Неутрален'),
        ('negative', 'Негативен'),
    ]

    input_text = models.TextField(verbose_name="Въведен текст")
    clean_text = models.TextField(verbose_name="Предобработен текст", blank=True, null=True)

    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES, verbose_name="Настроение")

    # Вероятности (scores)
    pos_score = models.FloatField(verbose_name="Вероятност Позитивен")
    neu_score = models.FloatField(verbose_name="Вероятност Неутрален")
    neg_score = models.FloatField(verbose_name="Вероятност Негативен")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата на анализ")

    def __str__(self):
        return f"{self.sentiment.upper()} - {self.input_text[:50]}..."

    class Meta:
        verbose_name = "Анализ на отзив"
        verbose_name_plural = "Анализи на отзиви"
        ordering = ['-created_at']
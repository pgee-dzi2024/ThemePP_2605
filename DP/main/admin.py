from django.contrib import admin
from .models import ReviewAnalysis

@admin.register(ReviewAnalysis)
class ReviewAnalysisAdmin(admin.ModelAdmin):
    list_display = ('id', 'sentiment', 'pos_score', 'neu_score', 'neg_score', 'created_at')
    list_filter = ('sentiment',)
    search_fields = ('input_text',)
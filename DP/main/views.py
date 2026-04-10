from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import AnalyzeTextSerializer
from .models import ReviewAnalysis
from .nlp.sentiment import predict_sentiment


class AnalyzeTextAPIView(APIView):
    def get(self, request):
        return Response(
            {"detail": "Use POST with JSON body: {'text': '...'}"},
            status=status.HTTP_200_OK
        )
    """
    POST /api/analyze/
    Body: {"text": "..."}
    Response: sentiment + scores + id
    """
    def post(self, request):
        serializer = AnalyzeTextSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data["text"]

        try:
            result = predict_sentiment(text)
        except Exception as exc:
            return Response(
                {"detail": f"Sentiment analysis failed: {str(exc)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        scores = result["scores"]
        sentiment = result["sentiment"]
        clean_text = result["clean_text"]

        obj = ReviewAnalysis.objects.create(
            input_text=text,
            clean_text=clean_text,
            sentiment=sentiment,
            pos_score=scores.get("positive", 0.0),
            neu_score=scores.get("neutral", 0.0),
            neg_score=scores.get("negative", 0.0),
        )

        return Response(
            {
                "id": obj.id,
                "sentiment": sentiment,
                "scores": {
                    "positive": obj.pos_score,
                    "neutral": obj.neu_score,
                    "negative": obj.neg_score,
                },
                "clean_text": clean_text,
            },
            status=status.HTTP_200_OK
        )

def index(request):
    return render(request, 'main/index.html')

def index_old(request):
    return render(request, 'main/index_old.html')

def index_alex(request):
    return render(request, 'main/index_alex.html')

def index_gpt(request):
    return render(request, 'main/index_gpt.html')


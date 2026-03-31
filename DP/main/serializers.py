from rest_framework import serializers

class AnalyzeTextSerializer(serializers.Serializer):
    text = serializers.CharField(allow_blank=False, trim_whitespace=True)

    def validate_text(self, value: str) -> str:
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Текстът е твърде кратък.")
        return value
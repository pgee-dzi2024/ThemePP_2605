import re

def clean_text(text: str) -> str:
    """
    Лека нормализация (достатъчна за дипломната):
    - trim
    - премахване на множество whitespace
    - махане на "празни" символи
    """
    if not text:
        return ""

    t = text.strip()

    # normalize whitespace
    t = re.sub(r"\s+", " ", t)

    # remove zero-width chars sometimes present in copy/paste
    t = t.replace("\u200b", "").replace("\ufeff", "")

    return t
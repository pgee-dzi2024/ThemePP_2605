# ============================================
# Анализатор на емоции в текст
# Дипломен проект – Приложно програмиране
# ============================================

from textblob import TextBlob
import matplotlib.pyplot as plt


# --------------------------------------------
# 1. Rule-based откриване на допълнителни емоции
# --------------------------------------------
def detect_emotions(text):
    """
    Откриване на конкретни емоции чрез ключови думи
    (Rule-based подход)
    """
    emotions = []

    emotion_keywords = {
        "Радост": ["happy", "love", "amazing", "great", "excellent"],
        "Гняв": ["angry", "terrible", "awful", "hate", "worst"],
        "Съмнение": ["not sure", "maybe", "i think", "unsure", "unclear", "?"],
        "Изненада": ["wow", "surprised", "unexpected", "amazed", "shocked"]
    }

    text_lower = text.lower()

    for emotion, keywords in emotion_keywords.items():
        for word in keywords:
            if word in text_lower:
                emotions.append(emotion)
                break

    return emotions


# --------------------------------------------
# 2. Основен Sentiment Analysis (TextBlob)
# --------------------------------------------
def analyze_sentiment(text):
    """
    Анализ на емоционалната насоченост чрез NLP модел
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        sentiment = "Позитивен"
    elif polarity < -0.1:
        sentiment = "Негативен"
    else:
        sentiment = "Неутрален"

    emotions = detect_emotions(text)

    return polarity, sentiment, emotions


# --------------------------------------------
# 3. Визуализация на резултата
# --------------------------------------------
def show_graph(polarity):
    """
    Графично представяне на резултата
    """
    labels = ["Негативен", "Неутрален", "Позитивен"]
    values = [0, 0, 0]

    if polarity > 0.1:
        values[2] = abs(polarity)
    elif polarity < -0.1:
        values[0] = abs(polarity)
    else:
        values[1] = 1

    plt.figure(figsize=(6, 4))
    plt.bar(labels, values)
    plt.title("Резултат от анализа на емоции")
    plt.ylabel("Оценка")
    plt.xlabel("Категория")
    plt.show()


# --------------------------------------------
# 4. Основна програма
# --------------------------------------------
def main():
    print("АНАЛИЗАТОР НА ОТЗИВИ")
    print("--------------------------------")
    print("Моля, въведете текст на английски език:\n")

    text = input()

    polarity, sentiment, emotions = analyze_sentiment(text)

    print("\nРЕЗУЛТАТ ОТ АНАЛИЗА")
    print(f"Емоционална насоченост: {sentiment}")
    print(f"Polarity стойност: {polarity:.2f}")

    if emotions:
        print("Открити допълнителни емоции:")
        for e in emotions:
            print(f"- {e}")
    else:
        print("Не са открити допълнителни емоции")

    show_graph(polarity)


# Стартиране на програмата
if __name__ == "__main__":
    main()

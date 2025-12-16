from textblob import TextBlob
import matplotlib.pyplot as plt


def detect_emotions(text):
    """
    Откриване на конкретни емоции чрез ключови думи
    """
    emotions = []

    emotion_keywords = {
        "Радост": ["happy", "love", "amazing", "great", "excellent"],
        "Гняв": ["angry", "terrible", "awful", "hate", "worst"],
        "Съмнение": ["not sure", "maybe", "i think", "unsure", "unclear"],
        "Изненада": ["wow", "surprised", "unexpected", "amazed", "shocked"]
    }

    text_lower = text.lower()

    for emotion, keywords in emotion_keywords.items():
        for word in keywords:
            if word in text_lower:
                emotions.append(emotion)
                break

    return emotions


def analyze_sentiment(text):
    """
    Основен анализ на нагласата
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


def show_graph(polarity):
    """
    Визуализация на резултата
    """
    labels = ['Негативен', 'Неутрален', 'Позитивен']
    values = [0, 0, 0]

    if polarity > 0.1:
        values[2] = 1
    elif polarity < -0.1:
        values[0] = 1
    else:
        values[1] = 1

    plt.bar(labels, values)
    plt.title("Резултат от анализа на емоции")
    plt.ylabel("Оценка")
    plt.show()


# ====== ОСНОВНА ПРОГРАМА ======
print("АНАЛИЗАТОР НА ОТЗИВИ (без превод)")
print("--------------------------------")

text = input("Въведи текст за анализ (на английски):\n")

polarity, sentiment, emotions = analyze_sentiment(text)

print("\nРЕЗУЛТАТ:")
print(f"Основна нагласа: {sentiment}")
print(f"Polarity стойност: {polarity:.2f}")

if emotions:
    print("Открити допълнителни емоции:")
    for e in emotions:
        print("-", e)
else:
    print("Не са открити допълнителни емоции")

show_graph(polarity)

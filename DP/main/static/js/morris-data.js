$(function () {

    //Глобален chart
    let chart = new Morris.Bar({
        element: 'morris-bar-chart',
        data: [
            { y: 'Позитивен', a: 0 },
            { y: 'Неутрален', a: 0 },
            { y: 'Негативен', a: 0 }
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Процент'],
        ymin: 0,
        ymax: 100,
        gridIntegers: true,
        resize: true,
        barColors: ["#7498d8"]
    });

    //бутон "Check"
    $("#analyzeBtn").click(function () {

        const text = $("#inputText").val();

        if (!text) {
            alert("Въведи текст!");
            return;
        }

        $.ajax({
            url: "/api/analyze/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ text: text }),

            success: function (response) {

                const scores = response.scores;

                //обновяване на chart-а
                chart.setData([
                    { y: 'Позитивен', a: Math.round(scores.positive * 100)},
                    { y: 'Неутрален', a: Math.round(scores.neutral * 100) },
                    { y: 'Негативен', a: Math.round(scores.negative * 100) }
                ]);

                // (по желание) console log
                console.log("Updated chart:", scores);


                //таблица
                const now = new Date();

                // формат: 01.04.2026
                const date = now.toLocaleDateString("bg-BG");

                // формат: 14:35:22
                const time = now.toLocaleTimeString("bg-BG");

                //проценти
                const pos = Math.round(scores.positive * 100);
                const neu = Math.round(scores.neutral * 100);
                const neg = Math.round(scores.negative * 100);

                //dominant sentiment
                let dominant = "Неутрален";
                if (pos > neu && pos > neg) dominant = "Позитивен";
                if (neg > pos && neg > neu) dominant = "Негативен";

                //confidence (най-високата стойност)
                const confidence = Math.max(pos, neu, neg);

                //текст дължина
                const textLength = response.clean_text.length;

                //update таблицата
                $("#analysisTable").html(`
                    <tr>
                        <td><strong>Позитивен</strong></td>
                        <td>${pos}%</td>
                    </tr>
                    <tr>
                        <td><strong>Неутрален</strong></td>
                        <td>${neu}%</td>
                    </tr>
                    <tr>
                        <td><strong>Негативен</strong></td>
                        <td>${neg}%</td>
                    </tr>
                    <tr>
                        <td><strong>Основна емоция</strong></td>
                        <td>${dominant}</td>
                    </tr>
                    <tr>
                        <td><strong>Увереност</strong></td>
                        <td>${confidence}%</td>
                    </tr>
                    <tr>
                        <td><strong>Дата</strong></td>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <td><strong>Време</strong></td>
                        <td>${time}</td>
                    </tr>
                    <tr>
                        <td><strong>Дължина на текста</strong></td>
                        <td>${textLength} символа</td>
                    </tr>
                    <tr>
                        <td><strong>ID на анализа</strong></td>
                        <td>${response.id}</td>
                    </tr>
                `);


            },

            error: function (err) {
                console.error(err);
                alert("Грешка при анализа!");
            }
        });

    });

});
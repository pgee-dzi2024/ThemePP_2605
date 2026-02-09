$(function () {

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [
            { y: 'Positive', a: 60 },
            { y: 'Neutral', a: 30 },
            { y: 'Negative', a: 85 }
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Percentage'],
        ymin: 0,
        ymax: 100,
        gridIntegers: true,
        resize: true
    });


});

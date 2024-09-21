import { fetchData } from "./fetchData.js";
export { drawXPbyTimeGraph, drawXPbyProjectGraph }

async function drawXPbyTimeGraph(jwt) {

    const XPquery = `
        {
            transaction(
                where: {
                type: { _eq: "xp" }
                _and: [
                    { path: { _like: "/johvi/div-01/%" } }
                    { path: { _nlike: "/johvi/div-01/piscine-%" } }
                ]
                }
            ) {
                type
                amount
                createdAt
                path
            }
        }`
    const XPs = await fetchData(jwt, XPquery);

    XPs.transaction.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let amounts = XPs.transaction.map(d => d.amount);
    let dates = XPs.transaction.map(d => new Date(d.createdAt).getTime());
    const ISOdates = dates.map(ms => new Date(ms).toISOString());
    const ticktext = ISOdates.map(date => date.split('T')[0]);

    amounts = calculateCumulativeAmounts(amounts);

    console.log(dates);

    var data = [{
        x: ISOdates,
        y: amounts,
        mode: 'lines+markers',
        text: 'XP, Time',
        type: 'scatter',
        marker: {
            color: 'rgb(66, 245, 188)',
            size: 8
        },
        line: {
            color: 'rgb(66, 245, 188)',
            width: 1
        }
    }];

    var layout = {
        hovermode: 'closest',
        autosize: true,
        height: 500,
        width: 2000,
        xaxis: {
            title: 'Date',
            tickvals: dates,
            ticktext: ticktext,
            tickangle: -80,
            tickformat: '%Y/%m/%d',
            automargin: true,
            tickfont: {
                size: 10
            },
        },
        yaxis: {
            title: 'XP Amount'
        }
    };

    Plotly.newPlot('graph', data, layout);
}

function calculateCumulativeAmounts(data) {
    let cumulativeAmount = 0;
    return data.map(d => {
        cumulativeAmount += d;
        return cumulativeAmount;
    });
}

async function drawXPbyProjectGraph(jwt) {

    const XPquery = `
        {
            transaction(
                where: {
                type: { _eq: "xp" }
                _and: [
                    { path: { _like: "/johvi/div-01/%" } }
                    { path: { _nlike: "/johvi/div-01/piscine-%" } }
                ]
                }
            ) {
                type
                amount
                createdAt
                path
            }
        }`
    const XPs = await fetchData(jwt, XPquery);

    let paths = XPs.transaction.map(d => {
        const parts = d.path.split("/");
        const result = parts[parts.length - 1];
        return result;
    });
    let amounts = XPs.transaction.map(d => d.amount);

    console.log(paths, amounts);

    var data = [{
        values: amounts,
        labels: paths,
        type: 'pie',
        text: amounts.map(amount => `${amount} XP`),
        hovertemplate: '%{label}: %{text}<br>%{percent:.2f}%',
        name: "",
    }];

    var layout = {
        autosize: true,
        height: 800,
        width: 800,
        hoverlabel: {
            font: {
                size: 20
            }
        }
    };

    Plotly.newPlot('graph', data, layout);
}
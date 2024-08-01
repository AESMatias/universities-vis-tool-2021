
let arrayOfData = []; // 30 max

const caseCitations = (data, enter, selectedCountry) => {

    arrayOfData.length = 0;

    // No hicimos esto con D3JS en el data join porque necesitamos ordenar
    // los datos aqui afuera antes de hacer el join.
    for (let i = 0; i < data.length; i++) {
        if (data[i].location === selectedCountry) {
            arrayOfData.push(data[i]);
        }
    }

    if (arrayOfData.length > 30) {
        arrayOfData.length = 30; //Reduce the amount of data to display only if it's greater than 30
    }

    // Order the data by number of students
    arrayOfData.sort((a, b) => {
        const numCitationsA = parseInt(a['citations score']);
        const numCitationsB = parseInt(b['citations score']);
        return numCitationsB - numCitationsA;
    });

    // Obtener las ubicaciones únicas de las universidades
    const locations = [...new Set(arrayOfData.map(data => data.location))];
    // const locations = [selectedCountry]
    // Configurar dimensiones del gráfico
    const width = 1000;
    const height = 500;

    // Ancho de cada grupo de barras
    const amount_of_groups = 30;

    let maxCitScore
    let minCitScore

    try {
        maxCitScore = d3.max(arrayOfData, data => parseInt(data['citations score']))
        minCitScore = parseInt(arrayOfData[arrayOfData.length - 1]['citations score'])
    } catch (e) {
        if (arrayOfData.length < 30) {
            maxCitScore = parseInt(arrayOfData[0]['citations score'])
            minCitScore = parseInt(arrayOfData[arrayOfData.length - 1]['citations score'])

        }

    }


    // Scale for the X axis
    const xScale = d3.scaleLinear()
        .domain([0, (maxCitScore)])
        .range([0, 300])

    // Scale for the Y axis
    const yScale = d3.scaleBand()
        .domain(arrayOfData.map(data => data.title))
        .range([0, height])
        .padding(0.2);

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        // .style("background-color", "rgba(200,250,200,0.5)")
        .attr("transform", "translate(0, 0)")
    svg.append('text')
        .text('CITATIONS SCORE')
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('x', 0)
        .attr('y', 20)
        .attr('fill', 'white')
        .style('font-size', '25px')
        .style('font-weight', '900')


    const locationGroups = svg.selectAll(".location-group")
        .data(locations)
        .enter()
        .append("g")
        .attr("class", "location-group")

    const uniTexts = svg.selectAll(".uni-text")
        .data(arrayOfData)
        .enter()
        .append("text")
        .text(data => {
            return data.title;
        })
        .style("user-select", "none") // Avoid text selection
        .attr("x", 0)
        .attr("y", data => (yScale(data.title) + yScale.bandwidth() / 2) + 45)
        .attr("text-anchor", "end") // Align the text to the end (left)
        .attr("alignment-baseline", "middle")
        .attr("class", "uni-text")
        .style("font-weight", "bold")
        .style("font-size", "12px")
        .style("fill", "white")

        .on("mouseover", function (event, d) {
            event.preventDefault();
            d3.select(this).style("cursor", "default")
            d3.select(this).style("fill", "white")
            d3.select(this).style("font-size", "16px")
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr("transform", "translate(20, 0)");
        })
        .on("mouseout", function () {
            d3.select(this).style("fill", "white")
            d3.select(this).style("font-size", "12px")
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr("transform", "translate(0, 0)")
        });

    const tooltip = d3.select("#chart-container")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "rgba(0,0,0,0.6)")
        .style("color", "white")
        .style("padding", "6px")
        .style("border-radius", "5px")
        .style("display", "none")
        .style("font-weight", "bold")
        .style('border', '1px solid white')


    const addLegend = () => {
        const xLegendScale = d3.scaleLinear()
            .domain([0, maxCitScore])
            .range([0, width - 700])

        const axisX = d3.axisTop(xLegendScale).ticks(6).tickPadding(3);

        const margin = { top: 20, right: 10, bottom: 10, left: 450 };

        // Create the legend
        svg.append("g")
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(axisX)
            .style("fill", "white")
            .selectAll("text").style("fill", "white")
            .style("user-select", "none")

        const values = [maxCitScore]; // Valores inicial y final
        values.forEach(value => {
            svg.append("text")
                .attr("x", xScale(value) + margin.left) // Posición del texto en x (alineado con el valor + margen izquierdo)
                .attr("y", margin.top + 15) // Posición del texto en y (20 unidades por encima del eje)
                .attr("text-anchor", "middle") // Alineación del texto en el centro
                .text(value)
                .style("font-size", "10px")
                .style('font-weight', 'bold')
                .style('fill', 'white')
                .style("user-select", "none")
        });
    };
    addLegend();



    let counterLabelClicks = 0 // Times the label (tooltip) has been clicked
    locationGroups.selectAll("rect") // Create the bars of the chart
        .data(location => arrayOfData.filter(data => data.location === location))
        .enter()
        .append("rect")
        .attr("x", 420)
        // .attr("y", data => yScale(data.title))
        .attr("width", data =>
            xScale(parseInt(data['citations score']))
        )
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")

        .on("mouseover", function (event, d) {
            uniTexts.style("font-size", "10px")
            d3.select(this).style("cursor", "pointer")
            d3.select(this).style("fill", "rgba(100,220,220,1)")
            // Show the label of the bar (tooltip)
            tooltip.style("display", "block")
                .style("left", (event.pageX + 80) + "px")
                .style("top", (event.pageY - 10) + "px")
                .html(d.title);

            for (let i = 0; i < uniTexts._groups[0].length; i++) {
                if (d.title === uniTexts._groups[0][i].innerHTML) {
                    tooltip.html(
                        "Citations score: " + d['citations score'] + "<br>"
                    );
                }

                if (uniTexts._groups[0][i].innerHTML === d.title) {
                    uniTexts._groups[0][i].style.fill = "rgba(200,240,255,1)";
                    uniTexts._groups[0][i].style.fontSize = "18px"
                    d3.select(uniTexts._groups[0][i])
                        .transition()
                        .duration(50)
                        .attr("transform", "translate(40, 0)");

                }
                else if (uniTexts._groups[0][i].innerHTML !== d.title) {
                    uniTexts._groups[0][i].style.fill = "rgba(150,150,150,0.25)"
                }
            }
        })

        .on("click", function (event, d) {

            tooltip.html(
                d.title + "<br>" +
                "Number of students: " + d['citations score'] + "<br>" +
                "Overall score: " + d['overall score'] + "<br>" +
                "Location: " + d.location + "<br>" +
                "Rank: " + d.ranking + "<br>" +
                "Citations score: " + d['citations score'] + "<br>" +
                "Gender ratio: " + d['gender ratio'] + "<br>" +
                "Industry income score: " + d['industry income score'] + "<br>" +
                "Intl outlook score: " + d['intl outlook score'] + "<br>" +
                "Percentage of intl students: " + d['perc intl students'] + "<br>" +
                "Research score: " + d['research score'] + "<br>" +
                "Students staff ratio: " + d['students staff ratio'] + "<br>" +
                "Teaching score: " + d['teaching score']
            )
                .style("background-color", "rgba(10,50,120,0.9)")
                .style('border', '1px solid white')
            counterLabelClicks++
            if (counterLabelClicks % 2 === 0) {
                tooltip.style("background-color", "rgba(0,0,0,0.6)")
                tooltip.style("border", "1px solid white")
                    .html("Citations score: " + d['citations score'] + "<br>")
            }

        })

        .on("mouseout", function () {
            counterLabelClicks = 0
            tooltip.style("display", "none") // Vanish 
                .style("background-color", "rgba(0,0,0,0.6)")
            uniTexts.style("fill", "white")
            uniTexts.style("font-size", "12px")

            d3.select(this).style("fill", "steelblue")
            // uniTexts.attr("transform", "translate(0, 0)")
            uniTexts
                .transition()
                .duration(100) // Duración de la transición en milisegundos
                .attr("transform", "translate(0, 0)");
        })
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr("x", 450)
        .attr("y", data => yScale(data.title) + 40)


    uniTexts.transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr("x", 400)

}

export default caseCitations;
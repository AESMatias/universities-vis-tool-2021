let arrayOfData = []; // 30 max

const thirdVis = (dataF, selectedCountry, attrOne, attrTwo) => {

    // Configurar dimensiones del gráfico
    const width = 1000;
    const height = 700;

    // Función para procesar los valores de los atributos
    const processAttributeValue = (value) => {
        if (typeof value === 'string') {
            // Remover comas y convertir a número
            return parseFloat(value.replace(',', ''));
        }
        return parseFloat(value);
    };

    // Procesar los datos
    dataF.forEach(d => {
        d[attrOne] = processAttributeValue(d[attrOne]);
        d[attrTwo] = processAttributeValue(d[attrTwo]);
    });

    // Si algún atributo es 'overall score', tomamos solo los dos primeros decimales
    if (attrOne === 'overall score' || attrTwo === 'overall score') {
        dataF.forEach(d => {
            if (attrOne === 'overall score') {
                d[attrOne] = parseFloat(d[attrOne].toFixed(2));
            }
            if (attrTwo === 'overall score') {
                d[attrTwo] = parseFloat(d[attrTwo].toFixed(2));
            }
        });
    }

    const filteredData = dataF.filter(d => d['location'] === selectedCountry);

    const AttrOneMax = d3.max(filteredData, d => d[attrOne]);
    const AttrTwoMax = d3.max(filteredData, d => d[attrTwo]);

    const attrOneMin = d3.min(filteredData, d => d[attrOne]);
    const attrTwoMin = d3.min(filteredData, d => d[attrTwo]);
    

    // Scale for the X axis
    const xScaleOne = d3.scaleLinear()
        .domain([0, AttrOneMax])
        .range([0, width-90])

    // Scale for the Y axis
    const yScaleOne = d3.scaleLinear()
        .domain([0,AttrTwoMax])
        .range([height-90,0])

    let filteredAndSortedData = dataF.filter(d => d['location'] === selectedCountry)
    filteredAndSortedData = d3.sort(filteredData, (a, b) => d3.ascending(a[attrOne], b[attrOne]))

    const svg = d3.select("#third-container")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("margin", "auto")
        .style("width", "100%")
        
        .append("svg")
        .style("background-color", "rgba(0,0,0,0.6)")
        .attr("width", width+50)
        .attr("height", height+50)
        .attr("viewBox", `0 0 ${width+50} ${height+50}`)
        .style('max-width', `${width+50}px`)
        .style('border', '3px solid white')
        .style('border-radius', '5px')
    // const svg = svgOutter.append("g")
        
    svg.append('text')
        .text(attrOne.toUpperCase())
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('x', width/2 - 60)
        .attr('y', height + 30)
        .attr('fill', 'white')
        .style('font-size', '25px')
        .style('font-weight', '900')

    svg.append('text')
    .text(attrTwo.toUpperCase())
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr('x', -50)
    .attr('y', height/2 -50)
    .attr('fill', 'white')
    .style('font-size', '25px')
    .style('font-weight', '900')
    .attr('transform', `rotate(90, ${10}, ${height / 2 - 50})`)

    const addLegendX = () => {

        const axisX = d3.axisBottom(xScaleOne).ticks(10).tickPadding(3);

        const margin = { top: height-50, right: 0, bottom: 0, left: 105 };

        // Create the legend
        svg.append("g")
        .attr('id','zoomX')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(axisX)
            // .style("fill", "white")
            .selectAll("text").style("fill", "white")
            .style("user-select", "none")
            .style("font-size", "12px")
            .style('font-weight', 'bold')
    };
    addLegendX();

    const addLegendY = () => {
        
        const scaleY = d3.scaleLinear()
        .domain([0,AttrTwoMax])
        .range([height-90,0])

        const axisY = d3.axisLeft(scaleY).ticks(10).tickPadding(3);

        const margin = { top: 40, right: 0, bottom: 0, left: 105 };

        // Create the legend
        svg.append("g")
        .attr('id','zoomY')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(axisY)
            .selectAll("text").style("fill", "white")
            .style("user-select", "none")
            .style("font-size", "12px")
            .style('font-weight', 'bold')
    };
    addLegendY();


    // const tooltip = d3.select("#third-container")
    //     .append("div")
    //     .style("position", "absolute")
    //     .style("background-color", "rgba(0,0,0,0.6)")
    //     .style("color", "white")
    //     .style("padding", "6px")
    //     .style("border-radius", "5px")
    //     .style("display", "none")
    //     .style("font-weight", "bold")
    //     .style('border', '1px solid white')

 

svg.selectAll("circle")
    .data(filteredAndSortedData, 
    (d, i) => `${d['ranking']}-${i}`)
    .join(
      enter => {
        // Primero agregamos los círculos para luego procesar las líneas
        const circles = enter.append("circle")
                .on("click", function (event, d) {
                d3.selectAll('.tooltip')
                .style("display", "block")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .html(d.title + "<br>" +
                    "Number students: " + d['number students'] + "<br>" +
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
                    "Teaching score: " + d['teaching score']);

        })
          .attr("cx", (data, i) => {
              return 105 + parseFloat(xScaleOne(data[attrOne]));
          })
          .attr("cy", (data, i) => {
              return 40 + parseFloat(yScaleOne(data[attrTwo]));
          })
          .attr("fill", "red")
          .attr("r", 8)
          .attr('stroke', "white")
          .attr('uni', (data, i) => data['title'])
          .on("mouseover", function (event, data) {
              d3.select(this).style("cursor", "pointer")
                .style("fill", "magenta")
                .style("font-size", "16px")
                .transition()
                .duration(50)
                .ease(d3.easeLinear)
                .attr("r", "20");

              const title = data['title'];
              d3.select('#selectedCountry').html(title);

              d3.selectAll('.tooltip')
                .style("display", "block")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .style('background-color', 'rgba(0,0,0,0.8)')
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .html(`${title}` + "<br>" + "<br>"+`${attrOne}: ${data[attrOne]}` + "<br>" + `${attrTwo}: ${data[attrTwo]}`);
          })
          .on("mouseout", function () {
              d3.select(this).style("fill", "red")
                .style("font-size", "12px")
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr("r", 5);

              d3.selectAll('.tooltip')
                .style("display", "none")
                .html('');
          });

          circles.each(function (d, i, nodes) {
            if (i > 0) {
                const prevCircle = d3.select(nodes[i - 1]);
                const currCircle = d3.select(this);
        
                // Añadimos las lineas del grafico multi línea
                svg.append("line")
                    .attr("id", "lineZoom")
                    .attr("x1", prevCircle.attr("cx"))
                    .attr("y1", prevCircle.attr("cy"))
                    .attr("x2", currCircle.attr("cx"))
                    .attr("y2", currCircle.attr("cy"))
                    .attr("stroke", "white")
                    .attr("stroke-width", 1.5)
                    .attr("data-x1", d3.select(nodes[i - 1]).datum()[attrOne])
                    .attr("data-y1", d3.select(nodes[i - 1]).datum()[attrTwo])
                    .attr("data-x2", d[attrOne])
                    .attr("data-y2", d[attrTwo])
                    .lower();
            }
        });

        return circles;
      },
      update => update,
      exit => exit.remove()
    );

    const uniTexts = svg.selectAll("circle")
    .data(filteredAndSortedData.filter(d => d['location'] === selectedCountry),(d, i) => `${d.ranking}-${i}`)
        .enter()
        .append("text")
        .text(data => {
            // return (data.title.length < 30) ? data.title : data.title.substring(0, 30) + "...";
            return data['title'];
        })
        .style("user-select", "none") // Avoid text selection
        .attr("x", 0)
        .attr("y", 11)
        .attr("text-anchor", "end") // Align the text to the end (left)
        .attr("alignment-baseline", "middle")
        .attr("class", "uni-text")
        .style("font-weight", "bold")
        .style("font-size", "12px")
        .style("fill", "white")


    uniTexts.transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr("x", 400)


        const points = svg.selectAll('circle');

        svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

        //containers axis
        const xAxis = svg.append('g')
        .attr('id', 'xAxis')

        const zoomController = (event) => {
            const { transform } = event;
    
            // Ajustar las escalas
            const xScale2 = transform.rescaleX(xScaleOne);
            const yScale2 = transform.rescaleY(yScaleOne);
    
            // Actualizando las escalas de la visualización
            svg.select('#zoomY').call(d3.axisLeft(yScale2));
            svg.select('#zoomX')
                .attr('transform', `translate(105, ${height - 50})`)
                .call(d3.axisBottom(xScale2));
    
            // Ajustar los puntos en el gráfico
            svg.selectAll('circle')
                .attr('cx', d => {
                    const newX = 105 + xScale2(d[attrOne]);
                    return Math.max(105, Math.min(newX, width + 15));
                })
                .attr('cy', d => {
                    const newY = 40 + yScale2(d[attrTwo]);
                    return Math.max(40, Math.min(newY, height - 50));
                });
    
            // Actualizar las líneas
            svg.selectAll('#lineZoom')
                .attr('x1', function(d) {
                    const newX = 105 + xScale2(d3.select(this).attr('data-x1'));
                    return Math.max(105, Math.min(newX, width + 15));
                })
                .attr('y1', function(d) {
                    const newY = 40 + yScale2(d3.select(this).attr('data-y1'));
                    return Math.max(40, Math.min(newY, height - 50));
                })
                .attr('x2', function(d) {
                    const newX = 105 + xScale2(d3.select(this).attr('data-x2'));
                    return Math.max(105, Math.min(newX, width + 15));
                })
                .attr('y2', function(d) {
                    const newY = 40 + yScale2(d3.select(this).attr('data-y2'));
                    return Math.max(40, Math.min(newY, height - 50));
                });
        };


        const margin = { top: height-50, right: 0, bottom: 0, left: 105 };
        const marginY = { top: 40, right: 0, bottom: 0, left: 105 };

        // const zoomSVG = d3.zoom()
        // .scaleExtent([1, 6])
        // .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
        // .translateExtent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
        // .on('zoom', zoomController);


    const zoomSVG = d3.zoom()
    .scaleExtent([1, 6])
    .extent([[0, 0], [width, height]])
    .translateExtent([[0, 0], [width, height]])

    .on('zoom', (event) => {
        if (event.transform.k > 5.99) {
            event.transform.k = 5.98;
        }
        if (event.transform.k < 1.01) {
            event.transform.k = 1.02;
        }
        zoomController(event);
    })

svg.call(zoomSVG);
        
}

export default thirdVis;
import caseCitations from './filterCases/caseCitations.js';
import caseIndustry from './filterCases/caseIndustry.js';
import caseNumStudents from './filterCases/caseNumStudents.js';
import caseResearch from './filterCases/caseResearch.js';
import caseTeaching from './filterCases/caseTeaching.js';
import thirdVis from './filterCases/thirdVis.js';

let selectedFilter = "Students";
// let orderByText = document.getElementById('orderBy'); // Debemos usar D3, no JS vanila
let orderByText = d3.select('#orderBy');
let selectedCountry = "Chile";
let AttributeOne = "teaching score";
let AttributeTwo = "research score";



const extractUniqueLocations = (data1, data2) => {
    const locations = new Set();
    
    data1.forEach(item => {
        if (item.location) {
            locations.add(item.location);
        }
    });
    
    data2.forEach(item => {
        if (item.location) {
            locations.add(item.location);
        }
    });
    
    return Array.from(locations).sort();
};

// FUNcion para actualizar el selector HTML jejeje
const updateLocationSelector = (locations) => {
    const selector = d3.select(".selectButton");
    
    selector.selectAll("option").remove();
    
    selector.append("option")
        .attr("value", "none")
        .attr("selected", true)
        .text("Select a country");
    
    locations.forEach(location => {
        selector.append("option")
            .attr("value", location)
            .text(location);
    });
};

// Funcion principal para cargar datos y actualizar cualquier selector
const initializeLocationSelector = () => {
    Promise.all([
        d3.json('merged_data.json'),
        d3.json('universities_ranking.json')
    ]).then(([data1, data2]) => {
        const uniqueLocations = extractUniqueLocations(data1, data2);
        updateLocationSelector(uniqueLocations);
    }).catch(error => {
        console.error("Error al cargar los datos:", error);
    });
};

d3.selectAll(".filterButton").on("click", function () {
    // alert('aaaa')
    const selectedOption = d3.select(this).property("value");
    selectedFilter = selectedOption;
    orderByText.innerHTML = "Order by: " + selectedFilter;
    d3.select('#orderBy').text("Order by: " + selectedFilter);
    launchPressed();
});

d3.selectAll(".selectButton").on("change", function () {
    try{
        selectedCountry = d3.select(this).property("value");
        // launchPressed();
    } catch (error) {
        console.log("Error: ", error);
    }
});

d3.selectAll("#launch").on("click", function () {
    try{
        launchPressed();
    } catch (error) {
        console.log("Error: ", error);
    }
});


d3.select("#AttributeOne").on("change", function () {
    // if (d3.select(this).property("value") == d3.select("#AttributeTwo").property("value")){
    //     alert("Please select different attributes");
    // }
    try{
        AttributeOne = d3.select(this).property("value");
        launchPressed();
    } catch (error) {
        console.log("Error: ", error);
    }
});

d3.select("#AttributeTwo").on("change", function () {
    if (d3.select(this).property("value") == d3.select("#AttributeOne").property("value")){
        alert("Please select different attributes");
    }
    AttributeTwo = d3.select(this).property("value");
    launchPressed();
});


const listOfCountries = [
    "Algeria",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belarus",
    "Belgium",
    "Botswana",
    "Brazil",
    "Brunei Darussalam",
    "Bulgaria",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Egypt",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Latvia",
    "Lebanon",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Malaysia",
    "Malta",
    "Mexico",
    "Montenegro",
    "Morocco",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Northern Cyprus",
    "Norway",
    "Oman",
    "Pakistan",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "Russian Federation",
    "Saudi Arabia",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Taiwan",
    "Thailand",
    "Tunisia",
    "Turkey",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Venezuela",
    "Vietnam"
  ];

const launchPressed = () => {
    d3.json('merged_data.json')
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                console.error("The data is not an array or is empty.");
                return;
            }

            const filteredData = data.filter(d => d && d['location'] === selectedCountry);

            if (filteredData.length === 0) {
                console.warn(`There is not data found for ${selectedCountry} country`);
                return;
            }

            // Limpiar contenedores
            d3.select("#chart-container").selectAll("*").remove();
            d3.select("#third-container").selectAll("*").remove();

            //  Manage the data that can be null or undefined
            const safeAccess = (obj, key) => obj && obj[key] !== undefined ? obj[key] : null;

            // Saftify the data
            const safeData = filteredData.map(d => ({
                ...d,
                'number students': safeAccess(d, 'number students'),
                'overall score': safeAccess(d, 'overall score'),
                'citations score': safeAccess(d, 'citations score'),
                'industry income score': safeAccess(d, 'industry income score'),
                'research score': safeAccess(d, 'research score'),
                'teaching score': safeAccess(d, 'teaching score')
            }));

            //  Calling the corresponding visualization
            switch (selectedFilter) {
                case "Students":
                    caseNumStudents(safeData, null, selectedCountry);
                    break;
                // case "Ranking":
                //     caseRanking(safeData, null, selectedCountry);
                //     break;
                case "Citations":
                    caseCitations(safeData, null, selectedCountry);
                    break;
                case "Research":
                    caseResearch(safeData, null, selectedCountry);
                    break;
                case "Industry":
                    caseIndustry(safeData, null, selectedCountry);
                    break;
                case "Teaching":
                    caseTeaching(safeData, null, selectedCountry);
                    break;
                default:
                    console.warn(`Not recognized filter: ${selectedFilter}`);
                    return;
            }

            // Calling the third visualization
            thirdVis(safeData, selectedCountry, AttributeOne, AttributeTwo);
        })
        .catch(error => {
            console.error("Error loading the data at launchpressed func: ", error);
        });
};


d3.select('#launch').on('click', launchPressed);
d3.select('#Compare').on('click', launchPressed); 
d3.select('.selectButton').on('change', function() {
    selectedCountry = this.value;
});

// Codigo para el mapa geografico
let globe, path, map_projection;

Promise.all([
    d3.json('low_custom.geo.json', d3.autoType),
    d3.json('merged_data.json', d3.autoType)
]).then(([data, merged_data]) => {
    drawMap(data, merged_data);
});

const colorScaleMap = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

const drawMap = (data, merged_data) => {
    const width = 970;
    const height = 800;

    globe = d3.select('#second-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'hsl(180,10%, 10%)')
        .style('border', '3px solid black')
        .style('border-radius', '5px')

    map_projection = d3.geoConicConformal();

    path = d3.geoPath().projection(map_projection);

    // Agregamos el tooltip
    const tooltip = d3.select('#second-container')
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "rgba(0,0,0,0.6)")
        .style("color", "white")
        .style("padding", "6px")
        .style("border-radius", "5px")
        .style("display", "block")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style('border', '1px solid white');

    const zoomController = (event) => {
        const { transform } = event;
        globe.selectAll('path')
            .attr('transform', transform);
    };


    const zoomGlobe = d3.zoom()
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

    globe.call(zoomGlobe);

    globe.selectAll('path')
        .data(data.features, (d, i) => d.properties.name)
        .join(
            enter => {
                d3.selectAll('.tooltip')
                .html('')
                .style("display", "none");

                const groupEnter = enter.append('path')
                    .attr('d', path)
                    .style('fill', (data, i) => {
                        const { name } = data.properties;
                        
                        let colour = 'black';

                        if (listOfCountries.includes(name)) {
                            d3.select('#selectedCountry').html(name);
                            d3.select(this).style('fill', 'red');

                            const universitiesArray = merged_data.filter(d => Object.values(d).includes(name));
                            colour = colorScaleMap(universitiesArray.length);
                        }
                        return colour;
                    })
                    .style('stroke', (data, i) => {
                        const { name } = data.properties;
                        
                        let colour = 'black';
                        if (selectedCountry === name) {
                        }
                        return colour;
                    })
                    .attr('class', 'country')
                    .attr('cursor', 'pointer')
                    .style('stroke-width', '1px')
                    .on('mouseover', function (event, data) {
                        const { name } = data.properties;
                        if (listOfCountries.includes(name)) {
                            d3.select('#selectedCountry').html(name);

                            const universitiesArray = merged_data.filter(d => Object.values(d).includes(name));
                            d3.selectAll('.tooltip')
                                .style("display", "block")
                                .style("font-size", "16px")
                                .style("font-weight", "bold")
                                .style("left", (event.pageX + 10) + "px")
                                .style("top", (event.pageY + 10) + "px")
                                .html(`${name}: ${universitiesArray.length} universities in the ranking.`);
                                d3.select(this).style('stroke', 'hsl(0, 80%, 50%)')
                        }
                    })
                    .on('mouseout', function (event, data) {
                        const { name } = data.properties;
                        if (listOfCountries.includes(selectedCountry)) {
                            d3.select('#selectedCountry').html(name);

                            d3.selectAll('.tooltip')
                                .html('')
                                .style("display", "none");
                        }
                        d3.select(this).style('stroke', 'black')
                        d3.select(this).style('stroke-width', '1px')
                    })
                    .on('click', function (event, data) {
                        const { name } = data.properties;
                        
                        if (listOfCountries.includes(name)) {
                            
                            d3.selectAll(".selectButton").property("value", name)
                            d3.select('#selectedCountry').html(name);
                            selectedCountry = name;
                            launchPressed();
                        d3.select(this).style('stroke', 'hsl(0, 80%, 50%)')
                        d3.select(this).style('stroke-width', '5px')
                        d3.select(this).transition().duration(750).style('stroke', 'black')
                        .style('stroke-width', '1px')
                        }

                    });

                return groupEnter;
            },
            update => update
                .attr('d', path)
                .style('fill', 'blue')
                .style('stroke', 'hsl(30, 40%, 20%)')
                .attr('class', 'country')
                .attr('cursor', 'pointer')
                .on('mouseover', function (event, data) {
                    const { name } = data.properties;
                    if (listOfCountries.includes(name)) {
                        d3.select('#selectedCountry').html(name);
                        d3.select(this).style('fill', 'red');
                    }
                }) // Esto nunca se utiliza, ya que el mapa nunca cambiara sus datos, no es necesario
                ,
            exit => exit.remove()
        );
};

document.addEventListener('DOMContentLoaded', (event) => {
    initializeLocationSelector();
});
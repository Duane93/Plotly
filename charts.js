function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var sampleNames = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleNames.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];  

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var id = result.otu_ids
    var label = result.otu_labels
    var sampleValues = result.sample_values
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
  
    //yticks = 
    console.log(id)
    // 8. Create the trace for the bar chart. 
    var trace = [{
      x: sampleValues.slice(0,10).reverse(),
      y: id.slice(0,10).map(otu_ID => `OTU${otu_ID}`).reverse(),
      type: "bar",
      text: label.slice(0,10).reverse(),
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barlayout = {
      title: "Top 10 Bacteria Cultures Found"     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barlayout);
        
    // 1. Create the trace for the buble chart
    var bubbleData = [{
      x: id,
      y: sampleValues,
      text: label,
      mode: "markers",
      marker: {sampleValues,
        color: id,
        size: sampleValues
      }}];
    
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample"
       };
  
       // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = metaArray[0];
    
    // 3. Create a variable that holds the washing frequency.
    var wash_f = wfreq
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash_f,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Speed" },
      axis: { range: [0, 10] },
      steps: [{ range: [0, 10], color: "black"}]
     
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0} 
     };

     Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  

  })};

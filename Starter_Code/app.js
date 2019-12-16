function getPlot(id) {
    
  // get the data from the json file
  d3.json("Data/samples.json").then((data)=> {
      console.log(data)

      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)

      // filter sample values by id 
      var samples = data.samples.filter(s => s.id.toString() === id)[0];

      console.log(samples);

      // get only top 10 sample values to plot and reverse for the plotly
      var sampleValues = samples.sample_values.slice(0, 10).reverse();

      // get only top 10 otu ids for the plot
      var idValues = (samples.otu_ids.slice(0, 10)).reverse();
      
      // get the otu id's to the desired form for the plot
      var idOtu = idValues.map(d => "OTU " + d)

      console.log(`OTU IDS: ${idOtu}`)

      // get the top 10 labels for the plot
      var labels = samples.otu_labels.slice(0, 10);

      console.log(`Sample Values: ${sampleValues}`)
      console.log(`Id Values: ${idValues}`)

      
      // create trace variable for the plot
      var trace = {
          x: sampleValues,
          y: idOtu,
          text: labels,
          type:"bar",
          orientation: "h",
      };

      // create data variable
      var data = [trace];

      // create layout variable to set plots layout
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 30,
              b: 20
          }
      };

      // create the bar plot
      Plotly.newPlot("bar", data, layout);

      //console.log(`ID: ${samples.otu_ids}`)
      
      // create the trace for the bubble chart
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels

      };

      // set the layout for the bubble plot
      var layout = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1300
      };

      // create the data variable 
      var data1 = [trace1];

      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout); 

      // create guage chart
   
   
      var data_g = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: samples.wfreq,
        title: { text: `Weekly Washing Frequency ` },
        type: "indicator",
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
                 steps: [
                  { range: [0, 2], color: "brown" },
                  { range: [2, 4], color: "red" },
                  { range: [4, 6], color: "yellow" },
                  { range: [6, 8], color: "teal" },
                  { range: [8, 9], color: "blue" },
                ] }
        }
      ];
      var layout_g = { 
          width: 700, 
          height: 600, 
          margin: { t: 0, b: 0 } 
        };
      Plotly.newPlot("gauge", data_g, layout_g);
    });
}
// create the function to get the necessary data
function getInfo(id) {
  // read the json file to get data
  d3.json("Data/samples.json").then((data)=> {
      
      // get the metadata info for the demographic panel
      var metadata = data.metadata;

      console.log(metadata)

      // filter meta data info by id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      // select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
      
      // empty the demographic info panel each time before getting new id info
      demographicInfo.html("");

      // grab the necessary demographic data data for the id and append the info to the panel
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

// create the function for the change event
function optionChanged(id) {
  getPlot(id);
  getInfo(id);
}
// create the function for the initial data rendering
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("Data/samples.json").then((data)=> {
      console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      getPlot(data.names[0]);
      getInfo(data.names[0]);
  });
}
init();

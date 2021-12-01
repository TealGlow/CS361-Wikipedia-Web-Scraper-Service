const express = require('express');
const bodyParser = require('body-parser');
const states = require('ustates');
const path = require('path');
const JSSoup = require('jssoup').default;
const axios = require('axios').default;
const htmlEntities = require('html-entities');
const dotEnv = require('dotenv').config();


const app = express();

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const ZIPCODE_VALIDATOR_URL = "http://localhost:5000/validate_zip?zipcode=";

const PORT = 3000
const PATH = path.join(__dirname);



app.get("/", function(req, res){
  res.send("Make a request to /location?zip=XXXX");
});



app.get("/location", function(req, res){
  // So, in order to scrape the wiki page, we need to convert the zip code to
  // "town_name, state"

  var Object_To_Send={
    weather: {current:"",five_day:""},
    location_info:{state:"", town:""},
    wikipedia:[""]
  };

  var errObj={
    message:"Error getting location data"
  };

  // validate the zipcode first
  const check_zip = axios.get(ZIPCODE_VALIDATOR_URL+req.query.zip)
  .then((response)=>{
    if(response.data.valid_zip){
      // get the weather data

      let state_name = states[response.data.state].name;
      let loc_name = [(response.data.city).replace(" ","_"), "_"+((state_name).replace(" ", "_")),response.data.city, state_name];

      // setting up the url
      wiki_url = "https://en.wikipedia.org/wiki/"+loc_name[0]+","+loc_name[1];
      wiki_url = wiki_url.replace(' ',""); // 1 final check

      const weather_url="https://api.openweathermap.org/data/2.5/weather?zip="+req.query.zip+"&units=imperial&appid="+WEATHER_KEY;
      const weather_5_url="http://api.openweathermap.org/data/2.5/forecast?zip="+req.query.zip+"&units=imperial&appid="+WEATHER_KEY;

      // get all 3 promises
      const weather_current_request = axios.get(weather_url);
      const req_wiki = axios.get(wiki_url);
      const weather_5_day_request = axios.get(weather_5_url);

      // this is from the javascript documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
      Promise.all([weather_current_request, req_wiki, weather_5_day_request])
      .then((response)=>{
        // all our promises came through.
        // 0 index is current weather
        Object_To_Send.weather.current = (response[0].data);

        // 1 index is wikipedia
        Object_To_Send.wikipedia = findWikiSection(response[1].data);
        Object_To_Send.location_info.state = loc_name[3];
        Object_To_Send.location_info.town = loc_name[2];

        // 2nd index is 5 day
        Object_To_Send.weather.five_day = (response[2].data);
        res.json(Object_To_Send);
      })
      .catch(()=>{
        // error with any of the promises, we need to handle that
        console.error("Error getting the data for this location");
        res.status(400).json(errObj);
      });
    }else{
      console.error("Invalid zipcode");
      res.status(400).json(errObj);
    }

  })
  .catch(()=>{
    console.error("Error validating zipcode");
    res.status(400).json(errObj);
  });

});




/*
          FUNCTIONS FOR HANDLING DATA AND ZIPCODES.
*/


function findWikiSection(rawData){
  //function that finds the wikipedia data sections and cleans it
  //console.log(rawData);
  var soup = new JSSoup(rawData);
  var resultArr = [];
  paragraphs = soup.findAll('p');

  for(var i=0; i<paragraphs.length-1; i++){
    // get the text for each paragraph element in the wikipedia page, and
    // add that to a string, where each paragraph is a new element.
    var temp = paragraphs[i].getText();
    if(temp!=""){
      resultArr.push(temp);
    }
  }
  // add the results as an array
  var merged = resultArr.toString();
  // clean more of the output

  merged = htmlEntities.decode(merged);

  // reg expression that finds anything between the characters [ and ] with
  // digits between 0-9, multiple
  merged = merged.replace(/\[\d+\]/gm,"");

  t = merged.split("\n");
  for(var j=0; j<t.length; j++){
    if(t[j][0] == ","){
      t[j]= t[j].substring(1);
    }
  }
  return t;
};



app.listen(PORT, function(){
  console.log("Server started on port " + PORT);
});

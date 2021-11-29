# WikiWebScraper

Name: Alyssa Comstock

Date: 11/27/2021

Class: CS 361 - Software Engineering I

Purpose: Micro-service

Description: RESTFUL API built in Node.js, Express.js, and other packages. On GET request the user will back a json
object containing the information from 2 API calls to a weather API, and the data from the Wikipeida article based on
the zip code from the GET request parameter.  The wikipedia data is cleaned, and split into strings based on the paragraph
tags in the HTML returned to the web scraper.

Note this is the public version of this git repo.


## Table of contents
- [Description](#wikiwebscraper)
- [How to Install](#how-to-install)
- [How to use](#how-to-use)
- [Example Ouput](#example-output)
- [Packages used](#Packages-used)


## How to install

requirements:
- [npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/download/)
- [Zip code validator service](https://github.com/cjpdx-dev/geoJSON-imager)

Installing:
1. Go to the directory that you wish to place this program
2. Place my program there:
```
For command line:
git clone https://github.com/TealGlow/CS361-Wikipedia-web-scraper-service.git
```
3. Open a terminal in the location of the app.js file:

4. install node modules / dependencies:
```
npm install
```
5. Run the program!
```
node app.js
```
6. (Optional) If you make any edits to the file, you can use nodemon to auto-rerun the program when changes are saved. Very nice if you need to change the port:
```
nodemon app.js
```


If it is running correctly it should output in the command line that it is running on localhost with the port specified.


## How to Use:
Make sure that the app.js file is running, you can change the port.
Make a GET request to the http:localhost:3000/location path.  Currently does not support POST requests.

Please note: this is using Chris's zip code validator, so that needs to be running at the same time.


Example:
```
http://localhost:3000/location?zip=97008
```

## Example how to request with Axios

Axios will return a promise from my API. This is obviously not the only way but as long as you make GET request to that path with the
corret format you should get the data back in JSON format.

```
const axios = require('axios');


// based on the axios example in their docs
// https://github.com/axios/axios

const data_request = axios.get("http://localhost:3000/location?zip=97008")
  .then((data)=>{
    // do whatever you want with this data
  }.catch((error)=>{
    // handle error
  });
```


## Example Output

Please read the documentation for the format of the [current](https://openweathermap.org/current) and [five day](https://openweathermap.org/forecast5) forecasts.

notes:
- The units will be imperial.  
- The five day forecast displays the weather for 5 days in 3 hour increments.



![image](https://user-images.githubusercontent.com/13501778/140249539-4ca815bf-9f4f-48ef-bfb3-2df884e6b745.png)



- Weather.current holds the current weather data returned from [this call](https://openweathermap.org/current)
- Weather.five_day holds the 5 day forecase in 3 hour increments from [five day](https://openweathermap.org/forecast5)
- Location information gives the town name and state name
- Wikipedia has the scrapped wikipage, an array of strings.


## Packages used
- [Axios](https://www.npmjs.com/package/axios)
- [Express](https://www.npmjs.com/package/express)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [html-entities](https://www.npmjs.com/package/html-entities)
- [jssoup](https://www.npmjs.com/package/jssoup)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [path](https://www.npmjs.com/package/path)
- [ustates](https://www.npmjs.com/package/ustates)

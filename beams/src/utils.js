import { jsonSchoolResponse } from './data/SchoolsData';
import {jsonCrimeData} from './data/CrimeData';

export const getSuburbId = async (suburb, suburb_state) => {
    // const res = await fetch(`http://b3ams.com.au:5000/suburb/${suburb}/${suburb_state}`);
    const res = await fetch(`http://localhost:5000/suburb/${suburb}/${suburb_state}`);
    const result = await res.json();
    return result[0].ids[0].id;
}

export const getDemographics = async (suburb, suburb_state, type) => {
    // const res = await fetch(`http://b3ams.com.au:5000/${type}/${suburb}/${suburb_state}`);
    const res = await fetch(`http://localhost:5000/${type}/${suburb}/${suburb_state}`);
    const result = await res.json();
    return result;
}

export const getStats = async (suburb, suburb_state) => {
    // const res = await fetch(`http://b3ams.com.au:5000/${type}/${suburb}/${suburb_state}`);
    const res = await fetch(`http://localhost:5000/AllStats/${suburb}/${suburb_state}`);
    const result = await res.json();
    return result;
}

export const getLocation = async (suburb, suburb_state) => {
    const res = await fetch(`http://open.mapquestapi.com/geocoding/v1/address?key=RLok66AiiE73bgmFH5KWI2FvKWqj7AiM&outFormat=json&location=${suburb}+${suburb_state}`);
    const result = await res.json();
    return result;
}

export const getSchools = async (lat, lng) => {
    const res = await fetch(`http://localhost:5000/Coords/${lat}/${lng}`);
    const result = await res.json();
    return result;
}

export const getNews = async (suburb, suburb_state) => {
    const url = `https://newsapi.org/v2/everything?q=${suburb}%20australia&sources=abc-news-au,cbs-news,fox-sports,nbc-news,the-new-york-times,the-washington-times&language=en&sortBy=popularity&apiKey=bf2f2f717b5144da9abca234ee7f31c7`;
    const res = await fetch(url);
    const result = await res.json();
    return result;
}

// Given the news article returned from newsapi.org
// Returns sentiment analysis scores on the news article
// Positive in scores[0], neutral in scores[1] and negative in scores[2]
// From the testing, the api doesnt seem to have any negative scoring, so maybe treat half the neutrals as negative idk.
// An idea for rating conversion: each positive = +2 stars, each neutral = -0.5 stars. Then divide by 5.
export const getSentiment = async (newsArticles) => {
    const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

    // Positive in scores[0], neutral in scores[1] and negative in scores[2]
    var scores = [0,0,0];
    deepai.setApiKey('2adbe484-819f-45e9-a270-602439ab410e');
    var limit = 10;
    if (newsArticles.articles.length < limit) {
        limit = newsArticles.articles.length;
    }
    for (let i = 0; i < limit; i++) {
        var resp = await deepai.callStandardApi("sentiment-analysis", {
                text: newsArticles.articles[i].description,
        });

        for (let iResp = 0; iResp < resp.output.length; iResp++) {
            if (resp.output[iResp] === "Positive") {
                scores[0]++;
            } else if (resp.output[iResp] === "Neutral") {
                scores[1]++;
            } else {
                scores[2]++;
            }
        }
    }
    // console.log(scores);
    return scores;
}

export const getSchoolRating = (suburb, suburb_state) => {
    const schoolArray = jsonSchoolResponse.data.schools;
    const arrayLength = schoolArray.length;
    let counter = 0;
    let ICSEA_sum = 0;
    for (var i = 0; i < arrayLength; i++) {
        if (schoolArray[i].Suburb && suburb && (schoolArray[i].Suburb.toLowerCase() === suburb.toLowerCase()) && (schoolArray[i].State.toLowerCase() === suburb_state.toLowerCase())) {
            ICSEA_sum = ICSEA_sum + schoolArray[i].ICSEA;
            counter++;
        }
    }
    if (counter === 0) {
        return 1000;
    } else {
        return ICSEA_sum/counter;
    }
}


export const getCrimeRate = async (suburb, suburb_state) => {
    const crimeArray = jsonCrimeData.data.crimes;
    const arrayLength = crimeArray.length;
    let crimeRate = 0;
    let numCrimes = 0;

    // Get total population
    const suburbInfo = await getDemographics(suburb, suburb_state, "AgeGroupOfPopulation");
    const population = suburbInfo.demographics[0].total;

    for (var i = 0; i < arrayLength; i++) {
        if(suburb && (crimeArray[i].suburb.toLowerCase() === suburb.toLowerCase())) {
            numCrimes = crimeArray[i].numCrimes;
        }
    }

    console.log("Num crimes", numCrimes);
    console.log("Population", population);

    crimeRate = numCrimes / population;
    console.log("crime rate", crimeRate);

    return crimeRate;
}
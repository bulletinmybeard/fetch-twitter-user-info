// bleeeeh
export {}

const request = require ('request');
const Cheerio = require ('cheerio');
const _       = require ('underscore');

/**
 * 
 * @param {string} username - Twitter username 
 */
const getUserJSON = async (username:string) => {
    return await new Promise((resolve, reject) => {
        request(`https://twitter.com/${username}`, (error, response, body) => {
            /**
             * Reject with request error message
             */
            if (error) {
                reject(error);
            }
            /**
             * Reject if response is not 200
             */
            if (response && response.statusCode != 200) {
                reject(`Response error! Status code ${response.statusCode}`);
            }
            /**
             * Pass in and load the HTML body content 
             */
            const $ = Cheerio.load(body);
            try {
                /**
                 * Grab the user JSON from the DOM object
                 */
                const JSONString:string = $('#init-data').val();
                /**
                 * Check if the DOM element/value could be found  
                 */
                if (_.isUndefined(JSONString)) {
                    reject('JSON user object not found!');
                }
                /**
                 * Parse the JSON string and return a JSON Object
                 */
                const userJSONObject = JSON.parse(JSONString);
                /**
                 * Check if the key 'profile_user' in userJSONObject exist
                 */
                if (!_.has(userJSONObject, 'profile_user')) {
                    reject('User JSON not found!');
                }
                /**
                 * Return the user info Object
                 */
                resolve(userJSONObject.profile_user);
            }catch(err) {
                /**
                 * Reject Promise and return error message 
                 */
                reject(err.message);
            };
        });
    }).catch(error => new Error);
};

// Retrieve user information (JSON)
getUserJSON('bulletinmybeard').then(console.log);

const request = require ('request');
const Cheerio = require ('cheerio');
const _ = require ('underscore');
const Promise = require ('bluebird');

const getUserJSON = async (username:string) => {
    return await new Promise((resolve, reject) => {
        request(`https://twitter.com/${username}`, (err, response, body) => {
            if (err) {
                reject(err);
            }
            const $ = Cheerio.load(body);
            try {
                const JSONString = $('#init-data').val();

                if (_.isUndefined(JSONString)) {
                    reject('JSON user object not found!');
                }

                const userJSONObject = JSON.parse(JSONString);
                if (!_.has(userJSONObject, 'profile_user')) {
                    reject('User JSON not found!');
                }
                resolve(userJSONObject.profile_user);
            }catch(error) {
                reject(error);
            };
        });
    }).catch(new Error);
};

getUserJSON('bulletinmybeard').then(console.log);

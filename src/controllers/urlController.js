const urlModel = require("../models/urlModel")

const shortid = require('shortid')
const redis = require("redis");

const { promisify } = require("util");

const redisClient = redis.createClient(
    13596,
    "redis-13596.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("hXtKcFJT91Wg5UnzBwgzO5yb0hN6aAEs", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});


const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const baseUrl = 'http://localhost:3001'

const urlShortner = async function (req, res) {
    try {

        let longUrl = req.body.longUrl

        if (!longUrl) { res.status(400).send({ status: false, message: "Please enter longUrl" }) }

        // create the url code
        let urlCode = shortid.generate()

        // check long url if valid using the regex 
        let regexLongUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(longUrl)

        if (!regexLongUrl) return res.status(400).send({ status: false, message: 'Invalid longUrl' })

        let url = await urlModel.findOne({ longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })

        // url exist and return the respose
        if (url) {
            return res.status(200).send({ status: true, data: url })
        }
        else {
            // join the generated short code the the base url
            const shortUrl = baseUrl + '/' + urlCode

            let data = {}
            data.longUrl = longUrl;
            data.shortUrl = shortUrl;
            data.urlCode = urlCode

            // invoking the Url model and create to the DB

            await urlModel.create(data)

            let urlData = await urlModel.findOne({ longUrl, shortUrl, urlCode, }, { __v: 0, createdAt: 0, updatedAt: 0, _id: -1 })

            return res.status(201).send({ status: true, data: urlData })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode;
        console.log(urlCode)

        if (!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid UrlCode." })

        const UrlData = await urlModel.findOne({ urlCode });

        if (!UrlData) return res.status(404).send({ status: false, message: "this urlCode is not present in our database" });

        const caching = await GET_ASYNC(`${req.params.urlCode}`);
        console.log(caching)

        if (caching) {

            return res.status(302).redirect(caching);
        } else {

            const UrlData = await urlModel.findOne({ urlCode });

            if (!UrlData) return res.status(404).send({ status: false, message: "this urlCode is not present in our database" });

            // console.log("UrlData:" + UrlData.longUrl)

            await SET_ASYNC(`${req.params.urlCode}`, UrlData.longUrl);

            return res.status(302).redirect(UrlData.longUrl)
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.getUrl = getUrl
module.exports.urlShortner = urlShortner
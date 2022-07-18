


 urlModel = require("../models/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')

const baseUrl = 'http:localhost:3001'

const urlShortner = async function (req, res) {
    try {
        const {
            longUrl
        } = req.body // destructure the longUrl from req.body.longUrl
        if (!req.body.longUrl) { res.status(400).send({ status: false, message: "Please enter longUrl" }) }
        // check base url if valid using constthe validUrl.isUri method
        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({ status: false, message: "Invalid base url" })
        }

        // if valid, we create the url code
        const urlCode = shortid.generate()

        // check long url if valid using the validUrl.isUri method
        if (validUrl.isUri(longUrl)) {


            let url = await urlModel.findOne({
                longUrl
            }).select({ longUrl: 1, shortUrl: 1, urlCode: 1 })

            // url exist and return the respose
            if (url) {
                res.status(200).send({ status: true, data: url })
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                let data = {}
                data.longUrl = longUrl;
                data.shortUrl = shortUrl;
                data.urlCode = urlCode

                // invoking the Url model and saving to the DB


                let url = await (await urlModel.create(data)).Select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })


                res.status(201).send({ status: true, data: url })

            }

            // exception handler

        } else {
            res.status(401).send({ status: false, message: 'Invalid longUrl' })
        }
    }
    catch (err) { res.status(500).send({ status: false, message: err.message }) }
}



module.exports.urlShortner = urlShortner
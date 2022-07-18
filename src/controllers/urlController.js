


 urlModel = require("../models/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')
function hasLowerCase(str) {
    return (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/.test(str));
}
const baseUrl = 'http:localhost:3001'

const urlShortner = async function (req, res) {
    try {
        let {
            longUrl
        } = req.body 
       
        
        // destructure the longUrl from req.body.longUrl
        if (!req.body.longUrl) { res.status(400).send({ status: false, message: "Please enter longUrl" }) }
      


// if(!hasLowerCase(longUrl)) return res.status(400).send({status:false,message:"url should be in lower case"})

function trim(str) {
      
    // Use trim() function
    var trimContent = str.trim();
      
    console.log(trimContent);
}
  
trim(longUrl)

        if (!longUrl)
            return res.status(400).send({ status: false, message: "Please ensure that you have entered correct url link" })
        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({ status: false, message: "Invalid base url" })
        }
       

        // if valid, we create the url code
        let urlCode = shortid.generate()

        // check long url if valid using the validUrl.isUri method
        if (validUrl.isUri(longUrl)
        ) {


            let url = await urlModel.findOne({
                longUrl
            }).select({ longUrl: 1, shortUrl: 1, urlCode: 1,_id:0 })

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


const getUrl = async (req, res) => {

    try {
        let urlCode = req.params.urlCode

        console.log(urlCode)
        //if(!urlCode) return res.status(400).send({status: false, message: "Invalid Request."})
        // find a document match to the code in req.params.code
        const url = await urlModel.findOne({urlCode})
        //let OringalUrl = url.longUrl
        console.log(url)
        if (url) {
            // when valid we perform a redirect
            return res.status(302).redirect(url.longUrl)
        } else {
            // else return a not found 404 status
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.getUrl = getUrl
module.exports.urlShortner = urlShortner
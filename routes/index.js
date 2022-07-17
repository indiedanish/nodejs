var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var express = require("express");

var router = express.Router();
const puppeteer = require("puppeteer");



router.get("/",  function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", jsonParser, async function (req, res, next) {
  try {
    // 200 status code means OK
    console.log("HELLO");
    console.log(req.body.link);
    //IDHR HAI MASLA SARA

    const link = req.body.link;
    async function scrapeProduct(url) {
      // const browser = await puppeteer.launch();
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });

      if (url.includes("amazon")) {
        var getDataFromAmazon = await page.evaluate(() => {
          var result = document
            .querySelectorAll("#imageBlock_feature_div script")[2]
            .innerText.substring(100);
          var findLastCommonString = result.lastIndexOf('shoppableScene"') + 23;

          var sliced = result.slice(0, findLastCommonString);

          return sliced;
        });
        browser.close();
        // console.log(getDataFromAmazon);
        // res.json(getDataFromAmazon);

        var newa = getDataFromAmazon.replace(/'/g, `"`);
        newa = JSON.parse(newa);

        var array = [];

        for (var i = 0; i < newa.initial.length; ++i) {
          array.push(newa.initial[i].hiRes);
        }

        console.log(array);
        res.json(array);

        return array;
      } else {
        const getDataFromEbay = await page.evaluate(() => {
          console.log("START");
          const image = document
            .querySelectorAll(".pic-vert-msk ul li")[0]
            .querySelector("a .v-pnl-item img").src;

          var count = document.querySelectorAll(".pic-vert-msk ul li").length;

          var array = [];

          for (var i = 0; i < count; i++) {
            console.log("HELLO");
            array.push(
              document
                .querySelectorAll(".pic-vert-msk ul li")
                [i].querySelector("a .v-pnl-item img")
                .src.replace("s-l64", "s-l1600")
            );
          }

          return array;
        });
        browser.close();

        console.log(getDataFromEbay);
        res.json(getDataFromEbay);

        return getDataFromEbay;
      }
    }

    await scrapeProduct(link);
  } catch (e) {
    console.log(e);
    res.status(500).send("Something broke!");
  }
  // for (var i = 0; i < data.length; i++) {
  //   download(data[i].replace("s-l64", "s-l1600"), `${i}.jpg`, function () {
  //     console.log("done");
  //   });
  // }
});


module.exports = router;

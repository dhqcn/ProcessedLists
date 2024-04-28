const fs = require("fs");
const https = require("https");

const file = fs.createWriteStream("AIP-Alpha7-latest.csv");

https.get("https://mcfp.felk.cvut.cz/publicDatasets/CTU-AIPP-BlackList/Latest/AIP-Alpha7-latest.csv", response => {
  var stream = response.pipe(file);

  stream.on("finish", function() {
    console.log("done");
  });
});

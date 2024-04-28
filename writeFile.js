const fs = require("fs");
const https = require("https");

const file = fs.createWriteStream("AIP-Alpha7-latest.csv");

https.get("https://mcfp.felk.cvut.cz/publicDatasets/CTU-AIPP-BlackList/Latest/AIP-Alpha7-latest.csv", response => {
  var stream = response.pipe(file);

  stream.on("finish", function() {
    console.log("done");
  });
});

const file2 = fs.createWriteStream("drop.txt");

https.get("https://www.spamhaus.org/drop/drop.txt", response => {
  var stream = response.pipe(file2);

  stream.on("finish", function() {
    console.log("done");
  });
});

const file3 = fs.createWriteStream("dshield.txt");

https.get("https://www.dshield.org/block.txt", response => {
  var stream = response.pipe(file3);

  stream.on("finish", function() {
    console.log("done");
  });
});

const fs = require("fs");
const https = require("https");

# const file = fs.createWriteStream("AIP-Alpha7-latest.csv");
#
# https.get("https://mcfp.felk.cvut.cz/publicDatasets/CTU-AIPP-BlackList/Latest/AIP-Alpha7-latest.csv", response => {
#  var stream = response.pipe(file);
#
#  stream.on("finish", function() {
#    console.log("done");
#  });
#});
#
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

const file4 = fs.createWriteStream("processed_Greynoise_blocklist.txt");

https.get("https://api.greynoise.io/v3/tags/869feaa1-dc77-4037-aee2-247b7a39cf7d/ips?format=txt&token=cyAPZPxaSCucY81X7eTSPg", response => {
  var stream = response.pipe(file4);

  stream.on("finish", function() {
    console.log("done");
  });
});

const file5 = fs.createWriteStream("dropv6.txt");

https.get("https://www.spamhaus.org/drop/dropv6.txt", response => {
  var stream = response.pipe(file5);

  stream.on("finish", function() {
    console.log("done");
  });
});

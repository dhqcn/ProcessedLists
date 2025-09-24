const fs = require("fs");
const https = require("https");

const file = fs.createWriteStream("nrd7_wildcard.txt");

https.get("https://cebeerre.github.io/dnsblocklists/NRD/nrd7_asterisk.txt", response => {
  var stream = response.pipe(file);

  stream.on("finish", function() {
    console.log("done");
  });
});

const file2 = fs.createWriteStream("nrd14-8_wildcard.txt");

https.get("https://cebeerre.github.io/dnsblocklists/NRD/nrd14-8_asterisk.txt", response => {
  var stream = response.pipe(file2);

  stream.on("finish", function() {
    console.log("done");
  });
});

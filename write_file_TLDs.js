const fs = require("fs");
const https = require("https");

const file = fs.createWriteStream("spam-tlds-adblock.txt");

https.get("https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/spam-tlds-adblock.txt", response => {
  var stream = response.pipe(file);

  stream.on("finish", function() {
    console.log("done");
  });
});

const file2 = fs.createWriteStream("spam-tlds-adblock-aggressive.txt");

https.get("https://gitlab.com/hagezi/mirror/-/raw/main/dns-blocklists/adblock/spam-tlds-adblock-aggressive.txt", response => {
  var stream = response.pipe(file2);

  stream.on("finish", function() {
    console.log("done");
  });
});

const file3 = fs.createWriteStream("spam-tlds-adblock-allow.txt");

https.get("https://gitlab.com/hagezi/mirror/-/raw/main/dns-blocklists/adblock/spam-tlds-adblock-allow.txt", response => {
  var stream = response.pipe(file3);

  stream.on("finish", function() {
    console.log("done");
  });
});

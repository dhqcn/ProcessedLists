const fs = require("fs");
const https = require("https");

const file = fs.createWriteStream("DoH_servers_IPs.txt");

https.get("https://public-dns.info/nameservers.txt", response => {
  var stream = response.pipe(file);

  stream.on("finish", function() {
    console.log("done");
  });
});

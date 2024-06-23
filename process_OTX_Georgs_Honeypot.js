const fs = require("fs").promises;

(async () => {

const file = await fs.readFile("OTX_Georgs_Honeypot.csv","utf8");

const filtered = file.replaceAll(/Indicator.*/g, "# Indicator");

const filtered = file.replaceAll(/Description.*/g, "# Discription");

const filtered = file.replaceAll(/IPv4.*/g, "# IPv4");

const filtered = file.replaceAll(/IPv6.*/g, "# IPv6");
  
await fs.writeFile("processed_OTX_Georgs_Honeypot.txt", filtered, "utf8");
  
})();

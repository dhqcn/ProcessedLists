const fs = require("fs").promises;

(async () => {

const file = await fs.readFile("AIP-Alpha7-latest.csv","utf8");

const filtered = file.replaceAll(/ "attacker".*/g, "");
  
await fs.writeFile("processed_AIP-Alpha7-latest.txt", filtered, "utf8");
  
})();

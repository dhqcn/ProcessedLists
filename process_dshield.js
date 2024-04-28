const fs = require("fs").promises;

(async () => {

const file = await fs.readFile("dshield.txt","utf8");

const filtered = file.replaceAll(/\.0.*/g, ".0/24");
  
await fs.writeFile("processed_dshield.txt", filtered, "utf8");
  
})();

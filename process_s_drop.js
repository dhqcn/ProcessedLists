const fs = require("fs").promises;

(async () => {

const file = await fs.readFile("drop.txt","utf8");

const filtered = file.replaceAll(/ ;.*/g, "");
  
await fs.writeFile("processed_drop.txt", filtered, "utf8");
  
})();

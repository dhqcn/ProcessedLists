const fs = require("fs").promises;

(async () => {

const file = await fs.readFile("dropv6.txt","utf8");

const filtered = file.replaceAll(/ ;.*/g, "");
  
await fs.writeFile("processed_dropv6.txt", filtered, "utf8");
  
})();

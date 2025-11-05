const fs = require('fs');
const https = require("https");

// Đường dẫn file input và output
const inputPath = 'DoH_servers_IPs.txt';
const outputPath = 'processed_DoH_servers_IPs.txt';

// Đọc file gốc
let lines = fs.readFileSync(inputPath, 'utf8').split('\n');

// Natural IP sorting helper
function sortIPs(ips) {
  return ips.sort((a, b) => {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < 4; i++) {
      if (pa[i] !== pb[i]) return pa[i] - pb[i];
    }
    return 0;
  });
}

// Main function
(async () => {
  try {
    const data = await fetchFile(url);
    let lines = data.split(/\r?\n/).filter((l) => l.trim() !== "");

    // Sort IPs
    lines = sortIPs(lines);

    // Add || at start and ^ at end
    const formatted = lines.map((line) => `||${line}^`).join("\n");

    // Save to file
    fs.writeFileSync(outputFile, formatted, "utf8");
    console.log(`✅ Done! Saved sorted file as: ${outputFile}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();

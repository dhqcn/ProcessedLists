const fs = require("fs");
const path = require("path");

// Input + Output file paths
const inputFile = path.join(__dirname, "DoH_servers_IPs.txt");
const outputFile = path.join(__dirname, "processed_DoH_servers_IPs.txt");

// Load file
const raw = fs.readFileSync(inputFile, "utf8");

// Split into lines and clean
let lines = raw
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0);

// Regex to detect IPv4
const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

// Separate IPv4 and IPv6
const ipv4 = [];
const ipv6 = [];

for (const ip of lines) {
  if (ipv4Regex.test(ip)) ipv4.push(ip);
  else ipv6.push(ip);
}

// Remove duplicates
const ipv4_unique = [...new Set(ipv4)];
const ipv6_unique = [...new Set(ipv6)];

// Sort IPv4 numerically
ipv4_unique.sort((a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 4; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
});

// Sort IPv6 using localeCompare
ipv6_unique.sort((a, b) => a.localeCompare(b, "en"));

// Combine output
const output = [...ipv4_unique, ...ipv6_unique].join("\n");

// Save to file
fs.writeFileSync(outputFile, output, "utf8");

console.log("Done! Sorted IP list saved to:", outputFile);


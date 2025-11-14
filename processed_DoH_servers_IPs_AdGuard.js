const fs = require("fs");
const path = require("path");

// Input + Output file paths
const inputFile = path.join(__dirname, "DoH_servers_IPs.txt");
const outputFile = path.join(__dirname, "processed_DoH_servers_IPs_AdGuard.txt");

// Load file
const raw = fs.readFileSync(inputFile, "utf8");

// Timestamp formatter (DD-MM-YYYY HH:MM:SS)
function formatTimestamp(date) {
  const pad = n => (n < 10 ? "0" + n : n);
  return (
    pad(date.getDate()) +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    date.getFullYear() +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

const timestamp = formatTimestamp(new Date());

// Split file into cleaned lines
let lines = raw
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0);

// Regex to detect IPv4
const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

// Arrays
const ipv4 = [];
const ipv6 = [];
let malformedCount = 0;

// Classify each line
for (const ip of lines) {
  if (ipv4Regex.test(ip)) {
    ipv4.push(ip);
  } else if (ip.includes(":")) {
    ipv6.push(ip);
  } else {
    malformedCount++;
  }
}

// Totals before deduplication
const totalIPv4 = ipv4.length;
const totalIPv6 = ipv6.length;

// Remove duplicates
const ipv4_unique = [...new Set(ipv4)];
const ipv6_unique = [...new Set(ipv6)];

// Counts after deduplication
const uniqueIPv4 = ipv4_unique.length;
const uniqueIPv6 = ipv6_unique.length;

// Duplicates removed
const removedIPv4 = totalIPv4 - uniqueIPv4;
const removedIPv6 = totalIPv6 - uniqueIPv6;
const totalRemoved = removedIPv4 + removedIPv6;

// Sort IPv4 numerically
ipv4_unique.sort((a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 4; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
});

// Sort IPv6 lexicographically
ipv6_unique.sort((a, b) => a.localeCompare(b, "en"));

// Format IP output lines
const formatLine = ip => `||${ip}^`;

// Create summary block
const summary = [
  `! ================================================`,
  `! IPv4 / IPv6 Processing Summary`,
  `! ================================================`,
  `! Timestamp:                 ${timestamp}`,
  `! Total IPv4 entries:        ${totalIPv4}`,
  `! Total IPv6 entries:        ${totalIPv6}`,
  `! Unique IPv4 entries:       ${uniqueIPv4}`,
  `! Unique IPv6 entries:       ${uniqueIPv6}`,
  `! Duplicates removed (IPv4): ${removedIPv4}`,
  `! Duplicates removed (IPv6): ${removedIPv6}`,
  `! Total duplicates removed:  ${totalRemoved}`,
  `! Malformed IP addresses:    ${malformedCount}`,
  `! ================================================`,
  `!`,
  ``
].join("\n");

// Build final output
const output =
  summary +
  [...ipv4_unique, ...ipv6_unique].map(formatLine).join("\n") +
  "\n";

// Write final file
fs.writeFileSync(outputFile, output, "utf8");

console.log("✅ Sorting and formatting complete! Output file saved to:", outputFile);

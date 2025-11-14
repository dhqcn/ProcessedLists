const fs = require("fs");
const path = require("path");

// --- SETTINGS ---
// Toggle prefix/suffix formatting
const FORMAT_LINES = true;

// Prefix & Suffix
const PREFIX = "||";
const SUFFIX = "^";

// ----------------

// Input file
const inputFile = path.join(__dirname, "DoH_servers_IPs.txt");

// Output files
const outputIPv4 = path.join(__dirname, "processed_DoH_IPv4_servers.txt");
const outputIPv6 = path.join(__dirname, "processed_DoH_IPv6_servers.txt");

// Load file
const raw = fs.readFileSync(inputFile, "utf8");

// Split & clean
let lines = raw
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0);

// IPv4 validation
const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

// IPv6 validation
const ipv6Regex =
  /^(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(([0-9A-Fa-f]{1,4}:){1,7}:)|(([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2})|(([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3})|(([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4})|(([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5})|([0-9A-Fa-f]{1,4}:)((:[0-9A-Fa-f]{1,4}){1,6})|:((:[0-9A-Fa-f]{1,4}){1,7}|:))$/;

// Arrays
const ipv4 = [];
const ipv6 = [];
const malformed = [];

// Validate input lines
for (const ip of lines) {
  if (ipv4Regex.test(ip)) ipv4.push(ip);
  else if (ipv6Regex.test(ip)) ipv6.push(ip);
  else malformed.push(ip);
}

// Count before dedupe
const ipv4_before = ipv4.length;
const ipv6_before = ipv6.length;

// Dedupe
const ipv4_unique = [...new Set(ipv4)];
const ipv6_unique = [...new Set(ipv6)];

const ipv4_duplicates_removed = ipv4_before - ipv4_unique.length;
const ipv6_duplicates_removed = ipv6_before - ipv6_unique.length;
const total_duplicates_removed = ipv4_duplicates_removed + ipv6_duplicates_removed;

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

// Timestamp (DD-MM-YYYY HH:MM:SS)
const now = new Date();
const pad = n => String(n).padStart(2, "0");
const timestamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

// Format lines if enabled
const formatLine = ip => FORMAT_LINES ? `${PREFIX}${ip}${SUFFIX}` : ip;

// Build summary block
const summaryBlock = [
  "# ================================================",
  "# IPv4 / IPv6 Processing Summary",
  "# ================================================",
  `# Timestamp:                 ${timestamp}`,
  `# Total IPv4 entries:        ${ipv4_before}`,
  `# Total IPv6 entries:        ${ipv6_before}`,
  `# Unique IPv4 entries:       ${ipv4_unique.length}`,
  `# Unique IPv6 entries:       ${ipv6_unique.length}`,
  `# Duplicates removed (IPv4): ${ipv4_duplicates_removed}`,
  `# Duplicates removed (IPv6): ${ipv6_duplicates_removed}`,
  `# Total duplicates removed:  ${total_duplicates_removed}`,
  `# Malformed IP addresses:    ${malformed.length}`,
  "# ================================================",
  "",
  ""
].join("\n");

// Write output files (summary + formatted IPs)
fs.writeFileSync(outputIPv4, summaryBlock + ipv4_unique.map(formatLine).join("\n"), "utf8");
fs.writeFileSync(outputIPv6, summaryBlock + ipv6_unique.map(formatLine).join("\n"), "utf8");

// Console output
console.log("=== Processing Completed ===");
console.log("Timestamp:", timestamp);
console.log("Malformed entries:", malformed.length);
if (malformed.length > 0) {
  malformed.forEach(ip => console.log("  -", ip));
}
console.log("-----------------------------------------------");
console.log("IPv4 saved to:", outputIPv4);
console.log("IPv6 saved to:", outputIPv6);


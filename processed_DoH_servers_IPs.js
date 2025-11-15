const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "DoH_servers_IPs.txt");
const outputFile = path.join(__dirname, "processed_DoH_servers_IPs.txt");

// Timestamp (DD-MM-YYYY HH:MM:SS)
function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");

  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} `
       + `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Validators
function isIPv4(ip) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}

function isIPv6(ip) {
  return /^[0-9a-fA-F:]+$/.test(ip) && ip.includes(":");
}

// Convert IP to sortable form
function ipToSortable(ip) {
  if (isIPv6(ip)) {
    return ip.split(":").map(s => s.padStart(4, "0")).join(":");
  }
  return ip.split(".").map(o => o.padStart(3, "0")).join(".");
}

try {
  // Read & clean lines
  const rawLines = fs.readFileSync(inputFile, "utf8")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Count before processing
  const ipv4_before = rawLines.filter(isIPv4).length;
  const ipv6_before = rawLines.filter(isIPv6).length;

  // Detect malformed entries
  const malformed = rawLines.filter(l => !isIPv4(l) && !isIPv6(l));

  // Valid IPs only
  const validIPv4 = rawLines.filter(isIPv4);
  const validIPv6 = rawLines.filter(isIPv6);

  // Remove duplicates
  const ipv4_unique = [...new Set(validIPv4)];
  const ipv6_unique = [...new Set(validIPv6)];

  const ipv4_duplicates_removed = validIPv4.length - ipv4_unique.length;
  const ipv6_duplicates_removed = validIPv6.length - ipv6_unique.length;
  const total_duplicates_removed = ipv4_duplicates_removed + ipv6_duplicates_removed;

  // Sort IPv4 and IPv6 separately
  ipv4_unique.sort((a, b) => ipToSortable(a).localeCompare(ipToSortable(b)));
  ipv6_unique.sort((a, b) => ipToSortable(a).localeCompare(ipToSortable(b)));

  // Raw output only — one IP per line
  const formattedOutput = [...ipv4_unique, ...ipv6_unique].join("\n");

  // Build Summary
  const timestamp = getTimestamp();

  const summary =
`# ================================================
# IPv4 / IPv6 Processing Summary
# ================================================
# Timestamp:                 ${timestamp}
# Total IPv4 entries:        ${ipv4_before}
# Total IPv6 entries:        ${ipv6_before}
# Unique IPv4 entries:       ${ipv4_unique.length}
# Unique IPv6 entries:       ${ipv6_unique.length}
# Duplicates removed (IPv4): ${ipv4_duplicates_removed}
# Duplicates removed (IPv6): ${ipv6_duplicates_removed}
# Total duplicates removed:  ${total_duplicates_removed}
# Malformed IP addresses:    ${malformed.length}
# ================================================`;
  
  // Write final file
fs.writeFileSync(
  outputFile,
  `${summary}\n${formattedOutput}\n`,
  "utf8"
);
  
  console.log("✅ Completed!");
  console.log(`📄 Output saved to: ${outputFile}`);

} catch (err) {
  console.error("❌ Error:", err);
}

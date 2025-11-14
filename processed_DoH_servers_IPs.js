const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "DoH_servers_IPs.txt");
const outputFile = path.join(__dirname, "processed_DoH_servers_IPs.txt");

// Convert IPs into a sortable form
function ipToSortable(ip) {
  if (ip.includes(":")) {
    // IPv6 - normalize each segment
    return ip
      .split(":")
      .map(part => part.padStart(4, "0"))
      .join(":");
  } else {
    // IPv4 - zero-pad each octet
    return ip
      .split(".")
      .map(oct => oct.padStart(3, "0"))
      .join(".");
  }
}

try {
  // Read input file
  const data = fs.readFileSync(inputFile, "utf8")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Separate IPv4 and IPv6
  const ipv4 = data.filter(ip => ip.includes("."));
  const ipv6 = data.filter(ip => ip.includes(":"));

  // Sort each separately
  ipv4.sort((a, b) => ipToSortable(a).localeCompare(ipToSortable(b)));
  ipv6.sort((a, b) => ipToSortable(a).localeCompare(ipToSortable(b)));

  // Combine results
  const sorted = [...ipv4, ...ipv6];

  // Write output
  fs.writeFileSync(outputFile, formatted, "utf8");

  console.log("✅ Sorting and formatting complete!");
  console.log(`Output saved to: ${outputFile}`);
} catch (err) {
  console.error("❌ Error processing file:", err);
}

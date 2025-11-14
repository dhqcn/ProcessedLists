const fs = require('fs');
const path = require('path');

// ---------- Helper functions ----------

// Validate IPv4
function isIPv4(ip) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip);
}

// Validate IPv6
function isIPv6(ip) {
  return /^[0-9a-fA-F:]+$/.test(ip);
}

// Remove duplicates
const ipv4_unique = [...new Set(ipv4)];
const ipv6_unique = [...new Set(ipv6)];

// Sort IPv4 correctly (numeric sort)
function sortIPv4(list) {
  return list.sort((a, b) => {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 4; i++) {
      if (pa[i] !== pb[i]) return pa[i] - pb[i];
    }
    return 0;
  });
}

// Sort IPv6 lexicographically (standard for IPv6 string order)
function sortIPv6(list) {
  return list.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

// ---------- Main Program ----------

const inputFile = path.join(__dirname, 'DoH_servers_IPs.txt');
const outputFile = path.join(__dirname, 'processed_DoH_servers_IPs.txt');

const raw = fs.readFileSync(inputFile, 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0);

const ipv4 = raw.filter(isIPv4);
const ipv6 = raw.filter(isIPv6);

const sortedIPv4 = sortIPv4(ipv4);
const sortedIPv6 = sortIPv6(ipv6);

// Combine output (IPv4 first)
const combined = [...sortedIPv4, ...sortedIPv6].join('\n');

// Write final output file
fs.writeFileSync(outputFile, combined, 'utf8');

console.log('Sorting complete! Output saved to:', outputFile);

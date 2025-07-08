const fs = require('fs');
const path = require('path');

// Đường dẫn tới file tải lên
const inputFile = path.join(__dirname, 'spam-tlds-adblock-aggressive.txt');
const outputFile = path.join(__dirname, 'most_abused_TLDs_Hagezi_blocklist_aggressive.conf');

// Đọc nội dung file
let lines = fs.readFileSync(inputFile, 'utf-8').split('\n');

// Xử lý từng dòng
let outputLines = [];

// Dòng đầu tiên luôn là comment yêu cầu
outputLines.push("# Most Abused TLDs Hagezi's blocklist");

for (let line of lines) {
  line = line.trim();

  // Thay dấu ! bằng dấu #
  if (line === '!') {
    outputLines.push('#');
    continue;
  }
  
  // Thay dòng [Adblock Plus] bằng server:
  if (line === '[Adblock Plus]') {
    outputLines.push('server:');
    continue;
  }

  // Thay dòng kiểu ||domain^
  if (line.startsWith('||') && line.endsWith('^')) {
    const domain = line.slice(2, -1); // bỏ "||" và "^"
    outputLines.push(`local-zone: "${domain}." always_nxdomain`);
    continue;
  }

  // Nếu không trùng điều kiện nào, giữ nguyên
  outputLines.push(line);
}

// Ghi ra file kết quả
fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

console.log(`✅ File đã được tạo: ${outputFile}`);

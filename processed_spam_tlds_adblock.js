const fs = require('fs');
const path = require('path');

// Đường dẫn tới file tải lên
const inputFile = path.join(__dirname, 'spam-tlds-adblock.txt');
const outputFile = path.join(__dirname, 'most_abused_TLDs_Hagezi_blocklist.txt');

// Đọc nội dung file
let lines = fs.readFileSync(inputFile, 'utf-8').split('\n');

// Xử lý từng dòng
let outputLines = [];

for (let line of lines) {
  line = line.trim();

  // Bỏ qua dòng bắt đầu bằng "!"
  if (line.startsWith('!') || line === '') continue;

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

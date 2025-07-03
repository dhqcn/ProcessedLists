const fs = require('fs');

// Đọc nội dung từ file
const inputPath = './spam-tlds-adblock.txt';
const outputPath = './most_abused_TLDs_Hagezi_blocklist.txt';

const rawText = fs.readFileSync(inputPath, 'utf-8');

// Thay thế từng dòng theo yêu cầu
const transformed = rawText
  .replace('[Adblock Plus]', 'server:')
  .split('\n')
  .map(line => {
    if (line.startsWith('||')) {
      return line
        .replace(/^(\|\|)(.+)(\^)$/, 'local-zone: "$2." always_nxdomain');
    }
    return line;
  })
  .join('\n');

// Ghi nội dung đã chuyển đổi ra file mới
fs.writeFileSync(outputPath, transformed, 'utf-8');

console.log(`✅ File created: ${outputPath}`);

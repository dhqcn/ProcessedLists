// processed_spam_tlds_adblock_allow.js

const fs = require("fs");
const inputFile = "spam-tlds-adblock-allow.txt";
const outputFile = "most_abused_TLDs_Hagezi_allowlist.conf";

// Đọc nội dung từ file gốc
let lines = fs.readFileSync(inputFile, "utf-8").split("\n");

// Thêm dòng đầu tiên và dòng thứ hai
let outputLines = [
  "# Most Abused TLDs Hagezi's allowlist",
  "server:"
];

// Áp dụng thay thế trên từng dòng
lines.forEach(line => {
  let newLine = line
    .replace("@@||", 'local-zone: "')
    .replace("^", '" always_transparent');
  if (newLine.trim() !== "") {
    outputLines.push(newLine);
  }
});

// Ghi nội dung mới vào file đích
fs.writeFileSync(outputFile, outputLines.join("\n"), "utf-8");

console.log(`✅ File đã được tạo: ${outputFile}`);

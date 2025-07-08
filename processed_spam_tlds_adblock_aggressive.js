const fs = require('fs');

// Đường dẫn file input và output
const inputPath = 'spam-tlds-adblock-aggressive.txt';
const outputPath = 'most_abused_TLDs_Hagezi_blocklist.conf';

// Đọc file gốc
let lines = fs.readFileSync(inputPath, 'utf8').split('\n');

// Dòng đầu tiên theo yêu cầu
let result = ['# Most Abused TLDs Hagezi\'s blocklist aggressive'];

let serverInserted = false;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Bỏ dòng chứa [Adblock Plus]
    if (line.trim() === '[Adblock Plus]') continue;

    // Đổi dòng bắt đầu bằng "!" thành "#"
    if (line.startsWith('!')) {
        line = '#' + line.slice(1);
    }

    // Khi gặp dòng bắt đầu bằng "||" lần đầu tiên
    if (!serverInserted && line.startsWith('||')) {
        // Tìm dòng cuối cùng bắt đầu bằng "#" để thay bằng "server:"
        for (let j = result.length - 1; j >= 0; j--) {
            if (result[j].startsWith('#')) {
                result[j] = 'server:';
                break;
            }
        }
        serverInserted = true;
    }

    // Thay thế "||" => local-zone: " và "^" => ." always_nxdomain
    if (line.startsWith('||')) {
        line = line.replace('||', 'local-zone: "').replace('^', '." always_nxdomain');
    }

    result.push(line);
}

// Ghi ra file mới
fs.writeFileSync(outputPath, result.join('\n'), 'utf8');

console.log(`✅ File đã được chuyển đổi và lưu thành: ${outputPath}`);

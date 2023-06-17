import * as autocorrect from 'autocorrect-node';
import glob from "glob";
import * as fs from "fs";

async function main() {
    // 扫描 /src 下所有 *.md 文件
    const files = glob.sync("./src/**/*.md");
    for (const file of files) {
        console.log("Checking", file)
        const content = fs.readFileSync(file, "utf-8");
        const fixed = autocorrect.format(content);
        if (content !== fixed) {
            console.log("Autocorrect", file);
            fs.writeFileSync(file, fixed);
        }
    }
}

void main();
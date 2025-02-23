import fs from "node:fs";
import ejs from "ejs";
import path from "node:path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.rmSync("./dist", {recursive: true, force: true});

const buf = fs.readFileSync("./data.json");
const templateData = JSON.parse(buf.toString());

const srcDir = fs.readdirSync("./src", {withFileTypes: true});
await processSourceFiles(srcDir);

async function processSourceFiles(entries) {
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const subDir = fs.readdirSync(path.join(__dirname, entry.path, entry.name), {withFileTypes: true});
            processSourceFiles(subDir);
            continue;
        }

        const fileName = entry.name;
        if (fileName.endsWith(".ejs")) {
            const str = await ejs.renderFile(path.join("src", fileName), templateData)
            fs.writeFileSync(path.join("dist", fileName.replace("ejs", "html")), str); //!
        } else {
            fs.cpSync(path.join(entry.path, fileName), path.join(path.join(entry.path.replace("src", "dist"), fileName)));
        }
    }
}

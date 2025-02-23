import fs from "node:fs";
import ejs from "ejs";
import path from "node:path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.rmSync(wdPath("dist"), {recursive: true, force: true});
fs.mkdirSync(wdPath("dist"));

const buf = fs.readFileSync(wdPath("data.json"));
const templateData = JSON.parse(buf.toString());

const srcDir = fs.readdirSync(wdPath("src"), {withFileTypes: true});
await processSourceFiles(srcDir);

async function processSourceFiles(entries) {
    for (const entry of entries) {
        const fileName = entry.name;

        if (entry.isDirectory()) {
            fs.mkdirSync(wdPath(entry.path, fileName).replace("src", "dist"))
            const subDir = fs.readdirSync(wdPath(entry.path, entry.name), {withFileTypes: true});
            await processSourceFiles(subDir);
            continue;
        }

        if (fileName.endsWith(".ejs")) {
            const str = await ejs.renderFile(wdPath("src", fileName), templateData);
            fs.writeFileSync(wdPath("dist", fileName.replace("ejs", "html")), str);
        } else {
            fs.cpSync(wdPath(entry.path, fileName), wdPath(entry.path, fileName).replace("src", "dist"));
        }
    }
}

function wdPath(...segments) {
    const joined = path.join(...segments).replaceAll(__dirname, "");
    return path.join(__dirname, joined);
}

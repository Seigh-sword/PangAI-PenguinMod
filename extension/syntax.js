
import { AILoader } from './AILoader.js';

export class PangCompiler {
    constructor() {
        this.engine = new AILoader();
    }

    async run(code) {

        const attachMatch = code.match(/attachURL\(url="([^"]+)"\)/);
        if (attachMatch) {
            this.engine.addAttachment(attachMatch[1]);
        }

        // 2. Handle Text: txt.prompt("...")send;
        if (code.includes('txt.prompt') && code.includes('send;')) {
            const promptMatch = code.match(/txt\.prompt\("([^"]+)"\)/);
            if (promptMatch) {
                const result = await this.engine.fetchText(promptMatch[1]);
                this.engine.clearAttachments(); // Clear context after sending
                return result;
            }
        }


        if (code.includes('img.prompt')) {
            const imgMatch = code.match(/img\.prompt\("([^"]+)"\)/);
            if (imgMatch) {
                return this.engine.fetchImageURL(imgMatch[1]);
            }
        }

        return "Syntax Error: Command not recognized.";
    }

    async executeScript(script) {
        const lines = script.split('\n');
        let finalResult = "";
        for (const line of lines) {
            if (line.trim() !== "") {
                finalResult = await this.run(line);
            }
        }
        return finalResult;
    }
}

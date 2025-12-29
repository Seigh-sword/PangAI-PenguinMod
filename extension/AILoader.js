/**
 * AILoader.js - The Professional Core for Pang AI
 */
export class AILoader {
    constructor() {
        this.bots = {
            'default': { system: "You are a helpful assistant.", model: 'openai', temp: 1, seed: 42 }
        };
        this.activeBot = 'default';
        this.attachments = [];
        this.onlineStatus = true;
    }

    createBot(name) {
        if (!this.bots[name]) {
            this.bots[name] = { 
                system: "You are a helpful assistant.", 
                model: 'openai', 
                temp: 1, 
                seed: Math.floor(Math.random() * 99999) 
            };
        }
    }

    switchBot(name) {
        if (this.bots[name]) this.activeBot = name;
    }

    // This handles the "ask active bot" and "txt.prompt" logic
    async fetchText(prompt, systemOverride = null) {
        const bot = this.bots[this.activeBot];
        const system = systemOverride || bot.system;
        
        let finalPrompt = prompt;
        if (this.attachments.length > 0) {
            finalPrompt = `Context Attachments: ${this.attachments.join(", ")}\n\nQuery: ${prompt}`;
        }

        const url = `https://text.pollinations.ai/${encodeURIComponent(finalPrompt)}?model=${bot.model}&system=${encodeURIComponent(system)}&seed=${bot.seed}&temperature=${bot.temp}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error();
            this.onlineStatus = true;
            return await response.text();
        } catch (e) {
            this.onlineStatus = false;
            return "Connection Error: Check your internet or the Pollinations API status.";
        }
    }

    // Handles the "get image URL" logic
    fetchImage(prompt) {
        const seed = Math.floor(Math.random() * 99999);
        // Using turbo for speed and nologo=true for a clean look
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&nologo=true&model=turbo`;
    }

    isReady() {
        return this.onlineStatus;
    }
}

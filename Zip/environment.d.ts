declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            embedId: string;
            hostingChannel: string;
            botId: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};
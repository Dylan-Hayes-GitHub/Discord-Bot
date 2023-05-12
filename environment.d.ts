declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            embedId: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};
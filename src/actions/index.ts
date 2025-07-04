import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
    askQuestion: defineAction({
        accept: "form",
        input: z.object({ question: z.string().min(1) }),
        handler: async (input) => {
            const result = await fetch("http://localhost:8787/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: input.question }),
            })
            if (!result.ok) {
                throw new Error("Failed to ask question");
            }
            return await result.json();

        }
    })
}
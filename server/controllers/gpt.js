import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "AIzaSyDo5qodBrHj04GS1nv61cAnT4Fjpeexcys"});

export async function demo(prompt) {

//   const prompt = userProblem;
const ans = [];
  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a DSA Instructor. You will only reply to the problem related to DSA. You have to solve query of user in simplest way.
        If user ask any question which is not related to DSA, then you have to reply with him rudly Example: How are you? You will reply: You dumb ask me some sensiable question related to DSA.
        
        You have to reply him rudely if question is related to DSA. Else reply him politely with single explanation.`
      },
    });
    ans.push(response.text);
    console.log(ans);
  }

  return await main();
//   return ans;
}
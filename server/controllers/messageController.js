import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import openai from "../configs/openai.js"
import imagekit from "../configs/imageKit.js"
// import { demo } from "./gpt.js";
import { GoogleGenAI } from "@google/genai";

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try{
        const userId = req.user._id

        // Check Credits
        if(req.user.credits < 1){
            return res.json({success: false, message: "You don't have enough credits to use this feature"})
        }
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: "user", content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    // console.log(choices[0].message);


    // const ai = new GoogleGenAI({apiKey: "AIzaSyDo5qodBrHj04GS1nv61cAnT4Fjpeexcys"});
    
    // async function demo(prompt) {
    
    // const ans = [];
    //   async function main() {
    //     const response = await ai.models.generateContent({
    //       model: "gemini-2.5-flash",
    //       contents: prompt,
    //       config: {
    //         systemInstruction: `You are a DSA Instructor. You will only reply to the problem related to DSA. You have to solve query of user in simplest way.
    //         If user ask any question which is not related to DSA, then you have to reply with him rudly Example: How are you? You will reply: You dumb ask me some sensiable question related to DSA.
            
    //         You have to reply him rudely if question is related to DSA. Else reply him politely with single explanation.`
    //       },
    //     });
    //     ans.push(response.text);
    //     console.log(ans);
    //   }
    
    //   await main();
    //   return ans;
    // }

    // const {resp} = await demo(prompt)
    // console.log(resp);
    // const reply = {...resp[0].message, timestamp: Date.now(), isImage: false}

    const reply = {...choices[0].message, timestamp: Date.now(), isImage: false}
    res.status(201).json({success: true, reply})
    chat.messages.push(reply)
    await chat.save()
    
    await User.updateOne({_id: userId}, {$inc: {credits: -1}})
    
    
    } catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}
// npm install openai


// Image Generation MessageController 
export const imageMessageController = async(req, res) => {
    try {
        const userId = req.user._id;
        // Check Credits
        if (req.user.credits < 2) {
            return res.status(400).json({ 
                success: false, 
                message: "You don't have enough credits to use this feature" 
            });
        }
        const {prompt, chatId, isPublished} = req.body
        // Find chat
        const chat = await Chat.findOne({userId, _id: chatId})

        // // Push user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: true
        });

        // Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt)

        // Construct ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        // Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })
        
        // Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

        // Upload to ImageKit Media Library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        });

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished,
        }
        res.status(201).json({success: true, reply})
        // res.status(201).json({success: true, message: 'hello'})
        
        
        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -2}})

    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}
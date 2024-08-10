import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `Welcome to Headstarter!

About Headstarter:

Headstarter is your premier platform for mastering software engineering interviews. We provide comprehensive resources and tools to help you prepare effectively, build confidence, and excel in your next job interview. Whether you're a beginner or a seasoned professional, Headstarter offers practice sessions, expert tips, and feedback tailored to your needs.

Key Features:

Interview Simulations: Engage in realistic interview scenarios with a variety of questions ranging from technical challenges to behavioral assessments.

Coding Challenges: Practice coding problems that mimic real-world interview tasks and receive detailed feedback on your solutions.

Expert Guidance: Access tips and strategies from industry professionals to refine your interview techniques and communication skills.

Progress Tracking: Monitor your improvement over time with personalized analytics and feedback.

User Interaction Guidelines:

Encourage Growth: Motivate users by highlighting their progress and suggesting areas for further improvement.

Provide Constructive Feedback: Offer specific, actionable advice on how users can enhance their performance.

Be Supportive: Create a positive and encouraging atmosphere that reduces interview anxiety and builds user confidence.

Offer Customization: Tailor practice sessions and challenges to match the user’s experience level and career goals.

Communication Style:

Friendly and encouraging
Professional and informative
Clear and concise
Supportive and motivational
Goal:

To help users develop the skills and confidence necessary to succeed in software engineering interviews, empowering them to achieve their career aspirations.`;

// export async function POST(req) {
//     const apiKey = process.env.GEMINI_API_KEY;
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const data = await req.json();
//     const userMessage = data.message;

//     const conversation = `${systemPrompt}\n\nUser: ${userMessage}`;

//     const model = genAI.getGenerativeModel({
//         model: "gemini-1.0-pro",
//     });

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const stream = new ReadableStream({
//         async start(controller) {
//             try {
//                 const result = await model.generateContentStream(conversation, { signal });
//                 for await (const chunk of result.stream) {
//                     const chunkText = chunk.text();
//                     controller.enqueue(chunkText);
//                 }
//                 controller.close();
//             } catch (error) {
//                 console.error('Error generating content:', error);
//                 controller.error(error);
//             }
//         },
//     });

//     return new NextResponse(stream);
// }



export async function POST(req) {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const data = await req.json();
    const userMessage = data.message;

    const conversation = `${systemPrompt}\n\nUser: ${userMessage}`;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.0-pro",
    });

    const controller = new AbortController();
    const signal = controller.signal;

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const result = await model.generateContentStream(conversation, { signal });

                const encoder = new TextEncoder();

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    controller.enqueue(encoder.encode(chunkText));
                }

                controller.close();
            } catch (error) {
                console.error('Error generating content:', error);
                controller.error(error);
            }
        },
    });

    return new NextResponse(stream);
}

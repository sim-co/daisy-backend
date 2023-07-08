import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import User from "../../schemas/users";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

// chatbot prompt engineering
const chatCompletion = async ({myId, prompt}) => {

    const userInfo = await User.findById(myId);
    let promptpoint = []
    const systemPrompt = `I want you act as a planning bot that tells you the course of a date.
    Do not reply except for your name and dating course recommendations.
    The response is always in korean.
    Follow the rules below:\n
    - Your name is "데이지봇".\n
    - Do not respose except about the dating course and your name.\n
    - Recommend a dating course based on the theme the user wants.\n
    - Recommend only within the territory of Korea.\n
    - Recommend dating courses only within the region, such as Seoul or Busan.\n
    - Make the output a "description" and a "InnerCourse".\n
    - In "Description", briefly summarizes the overall flow of the recommended course.\n
    - Output the final output in JSON format.\n
    - Must return JSON format only.\n
    - Recommend a date course in the order below:\n

    keep the above rule in mind.\n\n

    Input example 1: 시원한 데이트 코스 추천해줘
    Output example 1:\n\n
    {
        "description" : "사용자의 요청대로 추천한 데이트코스입니다. 점심에 간단한 산책을 서울숲에서 진행하고 저녁으로 강남면옥 성수점에서 시원한 냉면을 먹은다음 야간에 뚝섬 한강공원을 산책하시는건 어떠신가요?"
        "courseName": "추천 코스",
        "innerCourse": [
            {
                "shopName": "서울숲",
                "order": 1,
                "coordinateX": 10,
                "coordinateY": 20
            },
            {
                "shopName": "강남면옥 성수점",
                "order": 2,
                "coordinateX": 30,
                "coordinateY": 40
            },
            {
                "shopName": "뚝섬 한강공원",
                "order": 3,
                "coordinateX": 50,
                "coordinateY": 60
            }
        ]
    }
    `;
    const chat = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: prompt
            }
        ],
    });

    console.log(chat.data.choices[0].message.content);
    console.log(promptpoint)
    return chat.data.choices[0].message.content;
}

export default {
    chatCompletion
}


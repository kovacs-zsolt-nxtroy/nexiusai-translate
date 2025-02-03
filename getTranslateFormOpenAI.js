import axios from "axios";

export const getTranslateFormOpenAI = async (key, text, openAiKey) => {
    const exceptionWords = ['"sub module"',
        '"wizard"',
        '"Infinity"',
        '"Chat"',
        '"Function"',
        '"vector"',
        '"model"',
    ];
    const body = {
        "model": 'gpt-4o',
        "messages": [
            {
                "role": "system",
                "content": 'You are a person who speaks every language perfectly.'
            },
            {
                "role": "user",
                "content": "Translate the following English text into Hungarian, German, Romanian, Turkish, Chinese, Russian, do not translate the words " + exceptionWords.join(", ") + " —keep them exactly as they appear in the original text. Maintain the meaning and natural fluency in both target languages.\n Text: " + text
            }
        ],
        functions: [
            {
                name: "translate",
                description: "Text Translator",
                parameters: {
                    type: "object",
                    properties: {
                        Hungarian: {
                            type: "string",
                            description: "Hungarian translation."
                        },
                        German: {
                            type: "string",
                            description: "German translation."
                        },
                        Romanian: {
                            type: "string",
                            description: "Romanian translation."
                        },
                        Turkish: {
                            type: "string",
                            description: "Turkish translation."
                        },
                        Chinese: {
                            type: "string",
                            description: "Chinese translation."
                        },
                        Russian: {
                            type: "string",
                            description: "Russian translation."
                        }
                    },
                    required: ["Hungarian", "German", "Romanian", "Turkish", "Chinese", "Russian"]
                }
            }
        ],
    }
    const response = await axios.post('https://api.openai.com/v1/chat/completions',
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiKey}`
            }
        }
    );
    const dataArguments = response.data.choices[0].message.function_call.arguments;
    return {
        key: key,
        data: JSON.parse(dataArguments)

    }
}

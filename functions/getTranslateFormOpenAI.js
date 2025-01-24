import axios from "axios";

export const getTranslateFormOpenAI = async (key, text, openAiKey) => {
    const response = await axios.post('https://api.openai.com/v1/chat/completions',
        {
            "model": 'gpt-4o-mini',
            "messages": [
                {
                    "role": "system",
                    "content": 'You are a person who speaks every language perfectly.'
                },
                {
                    "role": "user",
                    "content": "Translate the english word " + text + " to Hungarian, German, Romanian, Turkish, Chinese, Russian"
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
        },
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

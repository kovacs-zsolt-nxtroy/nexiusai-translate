import {getTranslateFormOpenAI} from "./getTranslateFormOpenAI.js";

export const translate = async (baseDataList, openAIKey) => {
    const notProcessed = baseDataList.filter(baseData => baseData.status === 'NOT_PROCESSED');
    const translatePromiseList = notProcessed.map(issue => getTranslateFormOpenAI(issue.key, issue.en, openAIKey));
    const translateResponseList = await Promise.all(translatePromiseList);
    translateResponseList.forEach((translateResponse) => {
        console.log(translateResponse.key)
        const currentData = baseDataList.find(baseData => baseData.summary === translateResponse.key);
        currentData.status = 'NEW TRANSLATE'
        currentData.ru = translateResponse.data.Russian;
        currentData.ro = translateResponse.data.Romanian;
        currentData.zn = translateResponse.data.Chinese;
        currentData.tr = translateResponse.data.Turkish;
        currentData.hu = translateResponse.data.Hungarian;
        currentData.de = translateResponse.data.German;
    });
    return baseDataList;
}

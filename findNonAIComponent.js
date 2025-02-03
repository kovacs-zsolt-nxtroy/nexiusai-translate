import {getJira} from "./common.js";

export const findNonAIComponent = async (baseDataList, jiraApiKey, jiraUserName) => {
    const notProcessedSummaryList = baseDataList.filter(baseData => baseData.status === 'NOT_PROCESSED').map(baseData => baseData.summary);
    const idListString = notProcessedSummaryList.map(key => `summary ~ '${key}'`).join(' OR ');
    const jql = `project = NXT AND (${idListString})`;
    const componentsNorFrontOfficeList = await getJira(jql, jiraApiKey, jiraUserName);
    baseDataList.filter(baseData => baseData.status === 'NOT_PROCESSED').map((baseData) => {
        const issue = componentsNorFrontOfficeList.find(issue => issue.summary === baseData.summary);
        if (issue) {
            issue.status = 'ADD_COMPONENT';
            baseData.status = issue.status;
            baseData.key = issue.key;
            baseData.components = issue.components;
            baseData.componentsRaw = issue.componentsRaw;
            baseData.statusRaw = issue.statusRaw;
            baseData.ru = ['', null].includes(issue.ru) ? baseData.en : issue.ru;
            baseData.ro = ['', null].includes(issue.ro) ? baseData.en : issue.ro;
            baseData.zn = ['', null].includes(issue.zn) ? baseData.en : issue.zn;
            baseData.tr = ['', null].includes(issue.tr) ? baseData.en : issue.tr;
            baseData.hu = ['', null].includes(issue.hu) ? baseData.en : issue.hu;
            baseData.de = ['', null].includes(issue.de) ? baseData.en : issue.de;
        }
        return baseData;
    });
    return baseDataList;
}
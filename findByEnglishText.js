import {getJira} from "./common.js";

export const findByEnglishText = async (baseDataList, jiraApiKey, jiraUserName) => {
    const notProcessedEnList = baseDataList.filter(baseData => baseData.status === 'NOT_PROCESSED').map(baseData => baseData.en);
    const enListString = notProcessedEnList.map(key => `cf[10245] ~ '${key}'`).join(' OR ');
    const jql = `project = NXT AND (${enListString})`;
    const jiraFindByEnglish = await getJira(jql, jiraApiKey, jiraUserName);
    baseDataList.filter(baseDataFilter => baseDataFilter.status === 'NOT_PROCESSED').map((baseData) => {
        const issue = jiraFindByEnglish.find(issue => issue.en === baseData.en);
        if (issue) {
            issue.status = 'MODIFY_COMPONENT_KEY';
            baseData.status = issue.status;
            baseData.ru = ['', null].includes(issue.ru) ? baseData.en : issue.ru;
            baseData.ro = ['', null].includes(issue.ro) ? baseData.en : issue.ro;
            baseData.zn = ['', null].includes(issue.zn) ? baseData.en : issue.zn;
            baseData.tr = ['', null].includes(issue.tr) ? baseData.en : issue.tr;
            baseData.hu = ['', null].includes(issue.hu) ? baseData.en : issue.hu;
            baseData.de = ['', null].includes(issue.de) ? baseData.en : issue.de;
            baseData.description = `VALID KEY IN JIRA: ${issue.key}`;
        }
        return baseData;
    });
    return baseDataList;
}
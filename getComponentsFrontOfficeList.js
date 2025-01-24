import {getJira} from "./common.js";

/**
 * Jira API-n keresztül lekéri az AI.frontoffice komponenseket
 */
export const getComponentsFrontOfficeList = async (jiraApiKey, jiraUserName) => {
    const componentsFrontOfficeList = await getJira(`project = "NXT" AND component = "AI.frontoffice"`, jiraApiKey, jiraUserName);
    return componentsFrontOfficeList.map((issue) => {
        return {
            status: 'STORED',
            ...issue
        }
    });
}
import axios from "axios";

export const frontOfficeComponents =
    {
        self: 'https://nexiuslearning.atlassian.net/rest/api/2/component/11410',
        id: '11410',
        name: 'AI.frontoffice',
        description: 'Created by JiraManager for project NXT'
    }
export const getJira = async (jql, apiToken, username) => {
    const jiraUrl = 'https://nexiuslearning.atlassian.net/';
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    const maxResultsPerPage = 100;
    let allIssues = [];
    let startAt = 0;
    let total = 0;
    const items = [];
    const fields = [
        'status',
        'key',
        'summary',
        'customfield_10250',
        'customfield_10247',
        'customfield_10248',
        'customfield_10249',
        'customfield_10244',
        'customfield_10245',
        'customfield_10246',
        'components',
    ];
    do {
        try {
            const params = new URLSearchParams();
            params.append("jql", jql);
            params.append("startAt", startAt);
            params.append("maxResults", maxResultsPerPage);
            if (fields) {
                params.append("fields", fields.join(","));
            }
            const response = await axios.get(`${jiraUrl}/rest/api/2/search?${params.toString()}`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                }
            });
            const {issues, total: responseTotal} = response.data;

            const currentData = response.data.issues.map(issue => {
                return {
                    key: issue.key,
                    summary: issue.fields.summary,
                    components: issue.fields.components.map(component => component.name),
                    componentsRaw: issue.fields.components,
                    statusRaw: issue.fields.status,
                    ru: issue.fields.customfield_10250,
                    ro: issue.fields.customfield_10247,
                    zn: issue.fields.customfield_10248,
                    tr: issue.fields.customfield_10249,
                    hu: issue.fields.customfield_10244,
                    en: issue.fields.customfield_10245,
                    de: issue.fields.customfield_10246
                }
            })
            //const currentData = response.data.issues;
            total = responseTotal;
            items.push(...currentData);
            allIssues.push(...issues);
            startAt += maxResultsPerPage;

            console.log(`Lekérve: ${allIssues.length} / ${total}`);
        } catch (error) {
            console.error('Hiba történt a Jira problémák lekérdezésében:', error);
            break;
        }
    } while (allIssues.length < total);
    return items;
}
export const updateJiraComponents = async (issueKey, apiToken, username, components) => {
    const jiraUrl = 'https://nexiuslearning.atlassian.net/';
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');

    try {
        const response = await fetch(
            `${jiraUrl}/rest/api/2/issue/${issueKey}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        components: components // Update components here
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Hiba történt a frissítés során: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
            );
        }

        console.log(`Sikeresen frissítetted a(z) ${issueKey} 'components' mezőjét.`);
        return true;
    } catch (error) {
        console.error(`Hiba a(z) ${issueKey} frissítése közben: ${error.message}`);
        throw error;
    }
};
export const changeStatusToToDo = async (issueKey, apiToken, username) => {
    const jiraUrl = 'https://nexiuslearning.atlassian.net/';
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    try {
        const response = await fetch(
            `${jiraUrl}/rest/api/2/issue/${issueKey}/transitions`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transition: {id: 51}
                })
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Hiba történt a frissítés során: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
            );
        }

        console.log(`Sikeresen frissítetted a(z) ${issueKey} 'status' mezőjét.`);
        return true;
    } catch (error) {
        console.error(`Hiba a(z) ${issueKey} frissítése közben: ${error.message}`);
        throw error;
    }
}

export const getStatus = async (issueKey, apiToken, username) => {
    const jiraUrl = 'https://nexiuslearning.atlassian.net/';
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    console.log(auth)

    const response = await fetch(
        `${jiraUrl}/rest/api/2/issue/${issueKey}/transitions`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `Hiba történt a frissítés során: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
        );
    }

    console.log(`Sikeresen frissítetted a(z) ${issueKey} 'status' mezőjét.`);
    return {key: issueKey, response: await response.json()}


}
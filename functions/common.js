const axios = require("axios");

async function getJira(jql, apiToken, username) {
    const jiraUrl = 'https://nexiuslearning.atlassian.net/';
    const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
    const maxResultsPerPage = 100;
    let allIssues = [];
    let startAt = 0;
    let total = 0;
    const items = [];
    const fields = [
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

module.exports = {
    getJira
}
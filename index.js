#!/usr/bin/env node
import {getBaseLanguageData} from "./getBaseLanguageData.js";
import {getComponentsFrontOfficeList} from "./getComponentsFrontOfficeList.js";
import {signBaseDataFromComponentsFrontOffice} from "./signBaseDataFromComponentsFrontOffice.js";
import {XMLBuilder, XMLParser} from "fast-xml-parser";
import {copyFileSync, readFileSync, writeFileSync} from 'node:fs';
import {program} from "commander";
import {findNonAIComponent} from "./findNonAIComponent.js";
import {translate} from "./translate.js";
import {createEnglishFileFromBaseFile} from "./readBaseXlfAndCreateBaseEnglish.js";
import {changeStatusToToDo, frontOfficeComponents, updateJiraComponents} from "./common.js";

program
    .option('--first')
    .requiredOption('--jiraApiKey <value>', 'Jira API key')
    .requiredOption('--jiraUserName <value>', 'Jira username (e-mail address)')
    .requiredOption('--openAIKey <value>', 'Open AI API key');

program.parse();
const jiraApiKey = program.opts().jiraApiKey;
const jiraUserName = program.opts().jiraUserName;
const openAIKey = program.opts().openAIKey;

createEnglishFileFromBaseFile();
let baseDataList = getBaseLanguageData();
console.log('key count:', baseDataList.length);
const componentsFrontOfficeList = await getComponentsFrontOfficeList(jiraApiKey, jiraUserName);

console.log('jira front office count:', componentsFrontOfficeList.length);
baseDataList = signBaseDataFromComponentsFrontOffice(baseDataList, componentsFrontOfficeList);
console.log('front office find component:', baseDataList.filter(item => item.status === 'FOUND').length);
console.log('front office not find component:', baseDataList.filter(item => item.status !== 'FOUND').length);

// azokat a baseDataList elemeket, amelyekhez nem találtunk megfelelőt a componentsFrontOfficeList-ben, azokrol szedjük le az AI.frontoffice komponenst
componentsFrontOfficeList.filter(issue => issue.status !== 'FOUND').map(issue => issue.status = 'REMOVE_COMPONENT');
// azokat a baseDataList elemeket, amelyekhez nem találtunk megfelelőt a componentsFrontOfficeList-ben, azoknak a statusát ADD_COMPONENT-re állítjuk
baseDataList = await findNonAIComponent(baseDataList, jiraApiKey, jiraUserName);
// azokat a baseDataList elemeket, amelyekhez nem találtunk megfelelőt meg kerssük a Jira-ban english szövegben és megjelöljük MODIFY_COMPONENT_KEY státusszal és a description mezőben a Jira kulcsát
//baseDataList = await findByEnglishText(baseDataList, jiraApiKey, jiraUserName);


// azokat a baseDataList elemeket, amelyekhez nem találtunk megfelelőt, azokat lefordítjuk az OpenAI segítségével
baseDataList = await translate(baseDataList, openAIKey);

const fileProcessor = (fileName, trgLang, targetKey) => {
    copyFileSync('./src/locale/messages.en-US.xlf', fileName);
    const xmlSource = readFileSync(fileName, 'utf8');
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@@",
        format: true
    };
    const parser = new XMLParser(options);
    const sourceEnglishData = parser.parse(xmlSource);
    sourceEnglishData.xliff['@@trgLang'] = trgLang;
    sourceEnglishData.xliff.file.unit.map((unitData) => {
        const id = unitData['@@id']
        const translateRecord = baseDataList.find((item) => item.summary === id);
        unitData.segment.target = translateRecord[targetKey];
        return unitData;
    });
    const builder = new XMLBuilder(options);
    const output = builder.build(sourceEnglishData);
    writeFileSync(fileName, output, 'utf8');
}
await fileProcessor('./src/locale/messages.hu.xlf', 'hu', 'hu');
await fileProcessor('./src/locale/messages.de.xlf', 'de', 'de');
await fileProcessor('./src/locale/messages.ro.xlf', 'ro', 'ro');
await fileProcessor('./src/locale/messages.ru.xlf', 'ru', 'ru');
await fileProcessor('./src/locale/messages.tr.xlf', 'tr', 'tr');
await fileProcessor('./src/locale/messages.zn.xlf', 'zn', 'zn');

const addNexiusAIComponentList = baseDataList.filter(item => item.status === 'ADD_COMPONENT')
addNexiusAIComponentList.forEach(async (item) => {
    if (item.statusRaw.id === '10001') {
        await changeStatusToToDo(item.key, jiraApiKey, jiraUserName);
    }
    await updateJiraComponents(item.key, jiraApiKey, jiraUserName, [
            ...item.componentsRaw,
            frontOfficeComponents
        ]
    )
})
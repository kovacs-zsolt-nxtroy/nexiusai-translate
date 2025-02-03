import {XMLBuilder, XMLParser} from "fast-xml-parser";
import {copyFileSync, readFileSync, writeFileSync} from 'node:fs';

export const languageFileCreate = async (baseDataList, fileName, trgLang, targetKey) => {
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
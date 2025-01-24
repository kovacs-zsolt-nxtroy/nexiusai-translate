import {readFileSync} from 'node:fs';
import {XMLParser} from 'fast-xml-parser';

export const baseFileLanguageData = () => {
    const xmlSource = readFileSync('./src/locale/messages.xlf', 'utf8');
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@@",
        format: true
    };
    const parser = new XMLParser(options);
    const sourceEnglishData = parser.parse(xmlSource);
    return sourceEnglishData.xliff.file.unit.map((unitData) => {
        return {
            id: unitData['@@id'],
            source: unitData.segment.source
        }
    });
}

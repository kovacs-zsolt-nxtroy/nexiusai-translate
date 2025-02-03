import {XMLBuilder, XMLParser} from "fast-xml-parser";
import {readFileSync, writeFileSync} from 'node:fs';

export const createEnglishFileFromBaseFile = () => {
    const xmlSource = readFileSync('./src/locale/messages.xlf', 'utf8');
    const fileName = './src/locale/messages.en-US.xlf';
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@@",
        format: true
    };
    const parser = new XMLParser(options);
    const sourceEnglishData = parser.parse(xmlSource);
    sourceEnglishData.xliff['@@trgLang'] = 'en-US';
    sourceEnglishData.xliff.file.unit.map((unitData) => {
        unitData.segment.target = unitData.segment.source;
        return unitData;
    });
    const builder = new XMLBuilder(options);
    const output = builder.build(sourceEnglishData);
    writeFileSync(fileName, output, 'utf8');
}
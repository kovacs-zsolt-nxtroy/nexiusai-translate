/**
 * Összehasonlítja a baseDataList és a componentsFrontOfficeList listákat, és a baseDataList elemekhez hozzárendeli a componentsFrontOfficeList elemek adatait
 * a STORED státuszú elemekkel nem kell továbbiakban foglalkozni, azok már nyelvesítve vannak
 * @param baseDataList
 * @param componentsFrontOfficeList
 * @returns {*}
 */
export const signBaseDataFromComponentsFrontOffice = (baseDataList, componentsFrontOfficeList) => {
    baseDataList.map((baseData) => {
        const issue = componentsFrontOfficeList.find(issue => issue.summary === baseData.summary);
        if (issue) {
            issue.status = 'FOUND';
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
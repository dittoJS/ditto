/**
 * 
 * @param { String } exp "(item, indexName) in obj"
 */
export function parseForDir (exp) {
    let itemName, indexName, objName;
    let matchs
    let itemParamsRE = /^\(\s*(\w+)\s*\,\s*(\w+)\s*\)\s+in\s+(\w+)/;    // pattern like: "(item, indexName) in obj"
    let itemParamsNoIndexRE = /^\s*(\w+)\s+in\s+(\w+)/;                 // pattern like: "item in obj"

    if (matchs = exp.match(itemParamsRE)) {
        itemName = matchs[1]
        indexName = matchs[2]
        objName = matchs[3]
    } else if (matchs = exp.match(itemParamsNoIndexRE)) {
        itemName = matchs[1]
        indexName = 'index'
        objName = matchs[2]
    } else {
        return null
    }
    return {
        itemName,
        indexName,
        objName
    };
}
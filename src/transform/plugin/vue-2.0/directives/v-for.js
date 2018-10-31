export default function vForDir (desc) {
    let propStr =
        `v-for="(${desc.parseParams.itemName}, ${desc.parseParams.indexName}) in ${desc.parseParams.objName}"
            ` + (desc.key ? `:key='${desc.key}' ` : '');

    return propStr;
}

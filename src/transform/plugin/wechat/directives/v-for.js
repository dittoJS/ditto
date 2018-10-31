export default function vForDir (desc) {
    let propStr =
        `wx:for="{{${desc.parseParams.objName}}}"
                    wx:for-item='${desc.parseParams.itemName}'
                    wx:for-index='${desc.parseParams.indexName}'
                    ` + (desc.key ? `wx:key='${desc.key}'` : "");
    return propStr;
}

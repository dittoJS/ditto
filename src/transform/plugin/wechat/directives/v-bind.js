export default function vBindDir(desc) {
    let attr = '';
    if (desc.name === 'className') {
        attr = `class='${desc.params}'`;
    } else {
        attr = desc.isDynamic ? `${desc.name}='{{${desc.params}}}'` : `${desc.name}="${desc.params}"`;
    }

    return attr;
}

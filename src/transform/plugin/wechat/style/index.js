export default {
    beforeCompile (attr) {
        let matchs = attr.match(/(.+)rem/);
        if (matchs) {
            return Number(matchs[1]) * 100 + 'rpx';
        } else {
            return attr;
        }
    }
}
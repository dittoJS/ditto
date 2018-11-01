export default {
    beforeCompile (value, key) {
        let matchs
        if (typeof value === 'string') {
            matchs = value.match(/(.+)rem/);
        }
        if (matchs) {
            return {
                value: Number(matchs[1]) * 100 + 'rpx',
                key: key
            };
        } else {
            return {
                value,
                key
            };
        }
    }
}
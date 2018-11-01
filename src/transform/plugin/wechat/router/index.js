/**
 * Router template
 */
const template = `
Page({
    data: {
        path: '/'
    },
    onLoad () {
        console.log(this.route);
    }
})
`;
export default {
    template
}

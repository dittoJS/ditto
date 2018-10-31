let warn
let formatComponentName

if (process.env.NODE_ENV !== 'production') {
    const hasConsole = typeof console !== 'undefined'

    warn = (msg) => {
        if (hasConsole) {
            console.error('[Ditto warn]: ' + msg)
        }
    }
}

export { warn }

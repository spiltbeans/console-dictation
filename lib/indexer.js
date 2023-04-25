const ALIASES = {
    ERR: ['ERR', 'ERR', '0'],
    SYS: ['SYS', 'SYS', '1'],
    MISC: ['MISC', 'MISCELLANEOUS', '2']
}

const tracker = {
    ERR: 0,
    SYS: 0,
    MISC: 0,
    increment: function (type = 2) {
        if (ALIASES.ERR.includes(String(type).toUpperCase())) {
            this.ERR = this.ERR + 1
            return this.ERR
        } else if (ALIASES.SYS.includes(String(type).toUpperCase())) {
            this.SYS = this.SYS + 1
            return this.SYS
        } else if (ALIASES.MISC.includes(String(type).toUpperCase())) {
            this.MISC = this.MISC + 1
            return this.MISC
        }
    }
}
module.exports = { tracker }
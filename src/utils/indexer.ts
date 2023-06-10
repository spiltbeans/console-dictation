import { ALIASES } from "../core/config"

const tracker = {
	SYS: 0,
	ERR: 0,
	MISC: 0,
	increment: function (type = 2): number | undefined {
		if (ALIASES.SYS.includes(String(type).toUpperCase())) {
			this.SYS = this.SYS + 1
			return this.SYS
		} else if (ALIASES.ERR.includes(String(type).toUpperCase())) {
			this.ERR = this.ERR + 1
			return this.ERR
		} else if (ALIASES.MISC.includes(String(type).toUpperCase())) {
			this.MISC = this.MISC + 1
			return this.MISC
		}
		return undefined
	}
}
export { tracker }
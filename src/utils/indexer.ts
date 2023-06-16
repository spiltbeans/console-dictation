import { ALIASES } from "../core/config"

const tracker = {
	sys: 0,
	err: 0,
	misc: 0,
	increment: function (type = 2): number | undefined {
		if (ALIASES.sys.includes(String(type).toLowerCase())) {
			this.sys = this.sys + 1
			return this.sys
		} else if (ALIASES.err.includes(String(type).toLowerCase())) {
			this.err = this.err + 1
			return this.err
		} else if (ALIASES.misc.includes(String(type).toLowerCase())) {
			this.misc = this.misc + 1
			return this.misc
		}
		return undefined
	}
}
export { tracker }
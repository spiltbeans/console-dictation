const fs = require('fs')
const path = require('path')

const getTimeStamp = require('./timestamp')

class Dictator {
    paths = {}
    log_names = {}

    constructor(options) {
        this.paths['ERR_PATH'] = options?.ERR_PATH || path.join(process.cwd(), './logs/error')
        this.paths['MISC_PATH'] = options?.ERR_PATH || path.join(process.cwd(), './logs/misc')
        this.paths['SYS_PATH'] = options?.ERR_PATH || path.join(process.cwd(), './logs/system')

        this.log_names['ERR_LOG'] = options?.ERR_LOG || 'err.log'
        this.log_names['MISC_LOG'] = options?.MISC_LOG || 'misc.log'
        this.log_names['SYS_LOG'] = options?.SYS_LOG || 'sys.log'


    }

    error(message) {
        let log_path = path.join(this.paths.ERR_PATH, this.log_names.ERR_LOG)
        let long_message = `${getTimeStamp()} \t ${message} \n`

        write(long_message, this.paths.ERR_PATH, log_path)
    }
    
    system(message) {
        let log_path = path.join(this.paths.SYS_PATH, this.log_names.SYS_LOG)
        let long_message = `${getTimeStamp()} \t ${message} \n`

        write(long_message, this.paths.SYS_PATH, log_path)
    }

    misc(message) {
        let log_path = path.join(this.paths.MISC_PATH, this.log_names.MISC_LOG)
        let long_message = `${getTimeStamp()} \t ${message} \n`

        write(long_message, this.paths.MISC_PATH, log_path)
    }

    report({ type, message } = {}) {
        if (!type) return this.system(message)

        switch (type) {
            case ('ERR' || 'ERROR' || 0):
                this.error(message)
            case ('SYS' || 'SYSTEM' || 1):
                this.system(message)
            case ('MISC' || 2):
                this.misc(message)
            default:
                this.misc(message)
        }
    }

}

const write = (message, file_path, log_path) => {
    fs.open(log_path, 'wx', async (err, fd) => {
        if (err?.code !== 'ENOENT' && err?.code !== 'EEXIST') throw err

        if (err?.code === 'ENOENT') {   //folder not exist
            await fs.mkdirSync(file_path, { recursive: true }, err => { if (err) throw err })
            return await fs.writeFileSync(log_path, message, err => { if (err) throw err });
        }

        if (err?.code === 'EEXIST') {   //file exists
            return await fs.appendFileSync(log_path, message, err => { if (err) throw err })
        }

    })
}

const config = () => {
    return new Dictator()
}

// default module.exports = Dictator
module.exports = {
    config
}
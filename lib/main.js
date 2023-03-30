const fs = require('fs')
const path = require('path')

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

const getTimeStamp  = () => {
    let today = new Date().toLocaleString("en-US", {timeZone: "America/Toronto"})       // set timezone
    today = new Date(Date.parse(today))
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    let year = today.getFullYear();

    let hour = String(today.getHours()).padStart(2, '0')
    let minute = String(today.getMinutes()).padStart(2, '0')
    let second = String(today.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day}-${hour}:${minute}:${second}`
     
}


const PATHS = {
    ERR: path.join(process.cwd(), './logs/error'),
    MISC: path.join(process.cwd(), './logs/misc'),
    SYS: path.join(process.cwd(), './logs/sys')
}
const LOG_NAMES = {
    ERR: 'err.log',
    MISC: 'misc.log',
    SYS: 'sys.log'
}

const dictator = {

    config: ({ paths, log_names }) => {

        // error checking - paths and log name keys must match

        if (Object.keys(paths).length !== Object.keys(log_names).length) return "Could not complete config. Path and Log Name keys mismatch"

        for (let path_key in paths) {
            if (!log_names.hasOwnProperty(path_key)) return "Could not complete config. Path and Log Name keys mismatch"
        }

        // no errors

        for (let path_key in paths) (
            PATHS[path_key] = paths[path_key]
        )

        for (let log_key in log_names) (
            LOG_NAMES[log_key] = log_names[log_key]
        )
    },
    error: (message) => {
        const log_path = path.join(PATHS.ERR, LOG_NAMES.ERR)
        const log_message = `${getTimeStamp()} \t ${message}\n`

        write(log_message, PATHS.ERR, log_path)
    },
    system: (message) => {
        const log_path = path.join(PATHS.SYS, LOG_NAMES.SYS)
        const log_message = `${getTimeStamp()} \t ${message}\n`

        write(log_message, PATHS.SYS, log_path)
    },
    misc: (message, path={}) => {
        //if((path.keys).length)

        const log_path = path.join(PATHS.MISC, LOG_NAMES.MISC)
        const log_message = `${getTimeStamp()} \t ${message}\n`

        write(log_message, PATHS.MISC, log_path)
    },
    report: ({ type, message } = {}) => {
        if (!type) return this.system(message)

        switch (type) {
            case ('ERR' || 'ERROR' || 0):
                this.error(message)
            case ('SYS' || 'SYSTEM' || 1):
                this.system(message)
            case ('MISC' || 'MISCELLANEOUS' || 2):
                this.misc(message)
            default:
                this.misc(message)
        }
    }

}

module.exports = dictator
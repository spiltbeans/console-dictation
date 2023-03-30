const fs = require('fs')
const path = require('path')

const write = (message, file_path, log_name) => {

    const log_path = path.join(file_path, log_name)

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

const getTimeStamp = () => {
    let today = new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })       // set timezone
    today = new Date(Date.parse(today))
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    let year = today.getFullYear();

    let hour = String(today.getHours()).padStart(2, '0')
    let minute = String(today.getMinutes()).padStart(2, '0')
    let second = String(today.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day}-${hour}:${minute}:${second}`

}

const isRequestValid = (request, params) => {
    let missing = ""

    for (let param of params) {
        if (!request.hasOwnProperty(param)) missing += param + '\n'
    }
    return { 'isValid': !(missing.length), 'message': missing }

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

        const { isValid, message } = isRequestValid(log_names, Object.keys(paths))

        if (!isValid) return `Could not complete config. Path and Log Name keys mismatch. ${message}`

        // no errors

        for (let path_key in paths) (
            PATHS[path_key] = paths[path_key]
        )

        for (let log_key in log_names) (
            LOG_NAMES[log_key] = log_names[log_key]
        )
    },
    error: (message, path = {}) => {

        // check if a path is manually passed in
        const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

        const log_message = `${getTimeStamp()} \t ${message}\n`

        isValid ? (
            write(log_message, path?.PATH, path?.LOG_NAME)
        ) : (
            write(log_message, PATHS.ERR, LOG_NAMES.ERR)
        )
    },
    system: (message, path = {}) => {

        // check if a path is manually passed in
        const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

        const log_message = `${getTimeStamp()} \t ${message}\n`

        isValid ? (
            write(log_message, path?.PATH, path?.LOG_NAME)
        ) : (
            write(log_message, PATHS.SYS, LOG_NAMES.SYS)
        )
    },
    misc: (message, path = {}) => {

        // check if a path is manually passed in
        const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

        const log_message = `${getTimeStamp()} \t ${message}\n`

        isValid ? (
            write(log_message, path?.PATH, path?.LOG_NAME)
        ) : (
            write(log_message, PATHS.MISC, LOG_NAMES.MISC)
        )

    },
    report: ({ type, message, path = {} } = {}) => {
        if (!type) return this.misc(message, path)

        switch (type) {
            case ('ERR' || 'ERROR' || 0):
                this.error(message, path)
            case ('SYS' || 'SYSTEM' || 1):
                this.system(message, path)
            case ('MISC' || 'MISCELLANEOUS' || 2):
                this.misc(message, path)
            default:
                this.misc(message, path)
        }
    }

}

module.exports = dictator
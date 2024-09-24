const {createLogger, transports, format} = require("winston");

const logger = createLogger({
    transports: [
        new transports. Console({
            level: "info",
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: "YYYY-MM-DD HH:mm:dd"
                }),
                format.json()
            )
        }),
    ],
});

module.exports = logger;
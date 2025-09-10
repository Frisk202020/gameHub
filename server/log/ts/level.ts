const ERROR: LogLevel = {name: "ERROR", color: "#fa3838da"};
const INFO: LogLevel = {name: "INFO", color: "#5ffb5fda"};
const WARN: LogLevel = {name: "WARN", color: "#ffd95ada"};
const DEBUG: LogLevel = {name: "DEBUG", color: "#2cc6feda"};
const TRACE: LogLevel = {name: "TRACE", color: "#ec49fbda"};

export const logLevels = {
    ERROR,
    INFO,
    WARN,
    DEBUG,
    TRACE,
    *[Symbol.iterator](): Generator<Readonly<LogLevel>, void, Readonly<LogLevel> | undefined> {
        yield ERROR;
        yield INFO;
        yield WARN;
        yield DEBUG;
        yield TRACE;
    }
}
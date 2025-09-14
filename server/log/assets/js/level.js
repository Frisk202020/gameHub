const ERROR = { name: "ERROR", color: "#fa3838da" };
const INFO = { name: "INFO", color: "#5ffb5fda" };
const WARN = { name: "WARN", color: "#ffd95ada" };
const DEBUG = { name: "DEBUG", color: "#2cc6feda" };
const TRACE = { name: "TRACE", color: "#ec49fbda" };
export const logLevels = {
    ERROR,
    INFO,
    WARN,
    DEBUG,
    TRACE,
    *[Symbol.iterator]() {
        yield ERROR;
        yield INFO;
        yield WARN;
        yield DEBUG;
        yield TRACE;
    }
};

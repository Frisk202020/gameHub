interface Button {
    name: string,
    action: ()=>void
}

interface LogResponse {
    file_name: string,
    content: LogFormat[]
}

interface LogDisplay {
    display: boolean,
    element: HTMLParagraphElement
}

interface LogFormat {
    timestamp: string,
    level: string,
    fields: Fields,
    target: string
}

interface Fields {
    message: string
}

interface LogLevel {
    name: string,
    color: string
}
interface Button {
    name: string,
    action: ()=>void
}

interface LogResponse {
    file_name: string,
    content: LogFormat[]
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
function serialize(data) {
    var res = {};
    res.type = typeof data;
    res.data = {};
    switch (typeof data) {
        case "boolean":
        case "number":
        case "string":
        case "function":
            res.data = data.toString();
            break;
        case "undefined":
            res.data = "";
            break;
        case "object":
            if (data === null) {
                res.data = "";
                break;
            }
            for (let i in data) {
                res.data[i] = serialize(data[i]);
            }
            break;
    }
    return res;
}

function unserialize(data) {
    switch(data["type"]) {
        case "boolean":
        case "number":
        case "function":
            return eval("("+data["data"]+")");
            break;
        case "string":
            return data["data"].toString();
            break;
        case "undefined":
            return undefined;
            break;
        case "object":
            var res = {};
            if (data["data"] == "") return null;
            for (let i in data["data"]) {
                res[i] = unserialize(data["data"][i]);
            }
            return res;
            break;
    }
}

export {serialize, unserialize};
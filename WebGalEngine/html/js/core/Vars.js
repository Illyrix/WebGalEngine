import {serialize, unserialize} from './Serialization.js';

class Vars {
    constructor() {
        const self = this;

        const proxies = new WeakMap();

        const getGlobal = function (target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            if (typeof result == "object" && !proxies.has(result)) {
                const resProxy = new Proxy(result, {
                    get: getGlobal,
                    set: setGlobal,
                    deleteProperty: delGlobal
                });
                proxies.set(resProxy, true);
                Reflect.set(target, key, resProxy, receiver);
                return resProxy;
            }
            return result;
        }

        const setGlobal = function (target, key, value, receiver) {
            Reflect.set(target, key, value, receiver);
            self.saveGlobal();
            return true;
        }
        
        const delGlobal = function (target, key) {
            let res = delete target[key];
            self.saveGlobal();
            return res;
        }

        this.Global = new Proxy({}, {
            get: getGlobal,
            set: setGlobal,
            deleteProperty: delGlobal
        });

        const getLocal = function (target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            if (typeof result == "object" && !proxies.has(result)) {
                const resProxy = new Proxy(result, {
                    get: getLocal,
                    set: setLocal,
                    deleteProperty: delLocal
                });
                proxies.set(resProxy, true);
                Reflect.set(target, key, resProxy, receiver);
                return resProxy;
            }
            return result;
        }

        const setLocal = function (target, key, value, receiver) {
            return Reflect.set(target, key, value, receiver);
        }

        const delLocal = function (target, key) {
            return delete target[key];
        }

        this.Local = new Proxy({}, {
            get: getLocal,
            set: setLocal,
            deleteProperty: delLocal
        });
    }

    saveGlobal(path = window.EngineUser.Config.globalSavePath) {
        let data = serialize(this.Global);
        if (window.EngineObject === undefined)
            throw new Error("EngineObject is undefined. Did it run in WebGalEngine Env?");
        window.EngineObject.writeFile(path, data, false);
    }
}

export {Vars};
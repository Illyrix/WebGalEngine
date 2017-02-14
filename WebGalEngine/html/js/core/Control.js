import {serialize, unserialize} from './Serialization.js';

// 需要在wait过程中暂存的操作设置项名
const NEED_TEMP_ENABLEDS = ["rClickEnabled", "lClickEnabled", "mScrollEnabled", "keyEnterEnabled", "keyCtrlEnabled"];

let waitQueue = 0;
let tempEnableds = {};  // 暂存lClickEnable,keyEnterEnabled等操作设置

class Control {
    constructor () {
        let self = this;

        this.rClickEnabled = window.EngineUser.Default.ControlrClickEnabled;
        this.lClickEnabled = window.EngineUser.Default.ControllClickEnabled;
        this.mScrollEnabled = window.EngineUser.Default.ControlmScrollEnabled;
        this.keyEnterEnabled = window.EngineUser.Default.ControlKeyEnterEnabled;
        this.keyCtrlEnabled = window.EngineUser.Default.ControlKeyCtrlEnabled;

        this.onKeyEnter = function(){};
        this.onKeyCtrl = function(){};
        this.onMScroll = function(){};

        this.recordRead = window.EngineUser.Default.ContorlRecordRead;

        document.onmousewheel = (e) => {
            if (e.deltaY < 0)
                console.log("向上滚动滚轮:"+(-e.deltaY));
            else
                console.log("向下滚动滚轮:"+e.deltaY);
        };
        document.onkeydown = (e) => {
            if (e) {
                switch (e.keyCode) {
                    case 13: 
                        console.log("enter键被按下");       // 注意长按会反复调用
                        if (self.keyEnterEnabled && typeof self.onKeyEnter == "function")
                            self.onKeyEnter();
                        break;
                    case 17:
                        console.log("ctrl键被摁下");        // 反复调用
                        if (self.keyCtrlEnabled && typeof self.onKeyCtrl == "function")
                            self.onKeyCtrl();
                        break;
                    case 27:
                        console.log("esc被摁下");
                }
            }
        }
        let auto = window.EngineUser.Default.ContorlAuto;
        let skip = window.EngineUser.Default.ContorlSkip;
        Object.defineProperties(this, {
            auto: {
                get: () => auto,
                set: function(v) {
                    // auto开启或关闭
                    auto = v;
                }
            },
            skip: {
                get: () => skip,
                set: function(v) {
                    // skip开启或关闭
                    skip = v;
                }
            }
        });
    }

    listSaves () {
        if (EngineObject.existsFile(window.EngineUser.Config.saveMainfest)) {
            let mainfest = EngineObject.readFile(window.EngineUser.Config.saveMainfest);
            return JSON.parse(mainfest);
        }else{
            EngineObject.writeFile(window.EngineUser.Config.saveMainfest, "{}");
            return {};
        }
    }

    save (id, title) {
        let data = {};
        data['local'] = serialize(window.Engine.Vars.Local);
        data['draw'] = serialize(window.Engine.Draw);
        data['pc'] = window.Engine.Proc.pc;
        data['players'] = serialize(window.Engine.Audio.Players);
        let mainfest = this.listSaves();
        mainfest[id] = {
            title: title,
            saveTime: new Date().getTime(),            // <------时间戳
            saveFile: window.EngineUser.Config.savePath+id+".json",
            thumbFile: window.EngineUser.Config.savePath+id+".thumb"       // <------缩略图片
        };
        window.EngineObject.writeFile(window.EngineUser.Config.saveMainfest, JSON.stringify(mainfest), false);
        window.EngineObject.writeFile(mainfest[id]["saveFile"], JSON.stringify(data), false);
        // window.EngineObject.writeFile(mainfest[id]["thumbFile"], JSON.stringify(data), false);
            
    }

    load (id) {
        let mainfest = this.listSaves();
        if (mainfest[id] == undefined) {throw new Error("Load from illegal data"); return false;}
        let saveData = JSON.parse(EngineObject.readFile(mainfest[id]["saveFile"]));
        saveData["local"] = unserialize(saveData['local']);
        saveData["draw"] = unserialize(saveData['draw']);
        saveData['players'] = unserialize(saveData['players']);

        window.Engine.Proc.pc = saveData['pc'];

        for (let i in saveData['local']) {
            if (window.Engine.Vars.Local[i] == undefined)
                window.Engine.Vars.assignLocal(i);
            window.Engine.Vars.Local[i] = saveData['local'][i];
        }

        // 在载入的时候清除所有Players
        for (let i in window.Engine.Audio.Players) {
            window.Engine.Audio.Players[i].pause();
            window.Engine.Audio.Players[i].audioDOM.parentNode.removeChild(window.Engine.Audio.Players[i].audioDOM);
            delete window.Engine.Audio.Players[i];
        }
        window.Engine.Audio.Players = [];

        for (let i in saveData['players']) {
            let player = new window.Engine.Audio.Player();
            for (let j in saveData['players'][i]) {
                player[j] = saveData['players'][i][j];
            }
        }

        // 在载入的时候清除所有MessageLayers和PictureLayers
        for (let i in window.Engine.Draw.MessageLayers) {
            window.Engine.Draw.MessageLayers[i].div.parentNode.removeChild(window.Engine.Draw.MessageLayers[i].div);
            delete window.Engine.Draw.MessageLayers[i];
        }
        for (let i in window.Engine.Draw.PictureLayers) {
            window.Engine.Draw.PictureLayers[i].canvas.parentNode.removeChild(window.Engine.Draw.PictureLayers[i].canvas);
            delete window.Engine.Draw.PictureLayers[i];
        }
        window.Engine.Draw.MessageLayers = [];
        window.Engine.Draw.PictureLayers = [];

        for (let i in saveData['draw']['MessageLayers']) {
            let msgLayer = new Engine.Draw.MessageLayer();
            for (let j in saveData['draw']['MessageLayers'][i]) {
                if (j != "TextAreas")
                    msgLayer[j] = saveData['draw']['MessageLayers'][i][j];
                else{
                    for (let k in saveData['draw']['MessageLayers'][i]['TextAreas']) {
                        let txtArea = new Engine.Draw.TextArea(msgLayer);
                        for (let l in saveData['draw']['MessageLayers'][i]['TextAreas'][k]) {
                            txtArea[l] = saveData['draw']['MessageLayers'][i]['TextAreas'][k][l];
                        }
                    }
                }
            }
        }
        for (let i in saveData['draw']['PictureLayers']) {
            let picLayer = new Engine.Draw.PictureLayer();
            for (let j in saveData['draw']['PictureLayers'][i]) {
                picLayer[j] = saveData['draw']['PictureLayers'][i][j];
            }
        }
    }

    wait (time, callable) {
        if (waitQueue == 0) {    // 暂存操作设置
            for (let x in NEED_TEMP_ENABLEDS) {
                tempEnableds[NEED_TEMP_ENABLEDS[x]] = this[NEED_TEMP_ENABLEDS[x]];
            }
        }
        for (let x in NEED_TEMP_ENABLEDS) {
            // 禁止用户操作
            this[NEED_TEMP_ENABLEDS[x]] = false;
        }
        waitQueue ++;
        setTimeout(() => {
            if (callable != undefined) callable();
            waitQueue --;
            if (waitQueue <= 0) {
                for (let x in NEED_TEMP_ENABLEDS)
                this[NEED_TEMP_ENABLEDS[x]] = tempEnableds[NEED_TEMP_ENABLEDS[x]];
                waitQueue = 0;
            }
        }, time);
    }
}

export {Control};
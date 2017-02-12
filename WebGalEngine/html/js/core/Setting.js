class Setting{
    constructor () {
    }

    saveToFile () {
        window.EngineObject.writeFile(window.EngineUser.Config.settingPath, JSON.stringify(window.Engine.Setting), false);
    }
    loadFromFile () {
        if (window.EngineObject.existsFile(window.EngineUser.Config.settingPath)) {
            var str = window.EngineObject.readFile(window.EngineUser.Config.settingPath);
            var obj = JSON.parse(str);
            for (let i in obj)
                window.Engine.Setting[i] = obj[i];
        }
    }
    loadFromDefault () {
        window.Engine.Setting.bgmVolumn = window.EngineUser.Default.SettingBgmVolumn;
        window.Engine.Setting.spkVolumn = window.EngineUser.Default.SettingSpkVolumn;
        window.Engine.Setting.effVolumn = window.EngineUser.Default.SettingEffVolumn;
        window.Engine.Setting.readTxtSpd = window.EngineUser.Default.SettingReadTxtSpd;
        window.Engine.Setting.noReadTxtSpd = window.EngineUser.Default.SettingNoReadTxtSpd;
        window.Engine.Setting.autoModeSpd = window.EngineUser.Default.SettingAutoModeSpd;
        window.Engine.Setting.textNoDelay = window.EngineUser.Default.SettingTextNoDelay;
        window.Engine.Setting.isWindowed = window.EngineUser.Default.SettingIsWindowed; 
        window.Engine.Setting.skipNoRead = window.EngineUser.Default.SettingSkipNoRead;
    }
}

export {Setting};
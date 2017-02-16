class Setting{
    constructor () {
      this.loadFromDefault();
      this.loadFromFile();
    }

    saveToFile () {
        window.EngineObject.writeFile(window.EngineUser.Config.settingPath, JSON.stringify(this), false);
    }
    loadFromFile () {
        if (window.EngineObject.existsFile(window.EngineUser.Config.settingPath)) {
            var str = window.EngineObject.readFile(window.EngineUser.Config.settingPath);
            var obj = JSON.parse(str);
            for (let i in obj)
                this[i] = obj[i];
        }
    }
    loadFromDefault () {
        this.bgmVolumn = window.EngineUser.Default.SettingBgmVolumn;
        this.spkVolumn = window.EngineUser.Default.SettingSpkVolumn;
        this.effVolumn = window.EngineUser.Default.SettingEffVolumn;
        this.readTxtSpd = window.EngineUser.Default.SettingReadTxtSpd;
        this.noReadTxtSpd = window.EngineUser.Default.SettingNoReadTxtSpd;
        this.autoModeSpd = window.EngineUser.Default.SettingAutoModeSpd;
        this.textNoDelay = window.EngineUser.Default.SettingTextNoDelay;
        this.isWindowed = window.EngineUser.Default.SettingIsWindowed;
        this.skipNoRead = window.EngineUser.Default.SettingSkipNoRead;
    }
}

export {Setting};

// 用户系统运行配置
EngineUser.Config = {
    settingPath: "./config.json",   // Engine.Setting中系统设置存储的目录
    savePath: "./save/",            // 存档目录
    saveMainfest: "./save/mainfest.json",  // 存档的清单(包含几个存档,存档的文件名等)
    canvasRefresh: 16,              // 每?ms刷新canvas


};

// 默认值设定
EngineUser.Default = {
    SettingBgmVolumn: 1,
    SettingSpkVolumn: 1,
    SettingEffVolumn: 1,
    SettingReadTxtSpd: 200,
    SettingNoReadTxtSpd: 400,
    SettingAutoModeSpd: 400,
    SettingTextNoDelay: false,
    SettingIsWindowed: true,
    SettingSkipNoRead: false,

    MessageLayerTop: 0,
    MessageLayerLeft: 0,
    MessageLayerRight: 0,
    MessageLayerBottom: 0,
    MessageLayerWidth: 0,
    MessageLayerHeight: 0,
    MessageLayerAutoMargin: false,
    MessageLayerAlpha: 0.8,
    MessageLayerZIndex: 1000,
    MessageLayerBgImage: false,
    MessageLayerBgColor: "rgba(103, 228, 197, 0.3)",
    MessageLayerVisible: false,

    TextAreaText: "",
    TextAreaFont: {"font-family":"Microsoft YaHei", "font-size":"14px", "font-weight":"700",
        "line-height":"16px", "text-shadow":"2px 2px 4px orange",
        "-webkit-text-stroke":"1px green"},
    TextAreaTop: 0,
    TextAreaLeft: 0,
    TextAreaBottom: 0,
    TextAreaRight: 0,
    TextAreaNoAnime: false,

    PictureLayerSrc: "",
    PictureLayerVisible: false,
    PictureLayerAlpha: 1,
    PictureLayerClip: {left:0, top:0, width:0, height:0, enable:false},
    PictureLayerScale: 1,
    PictureLayerReversVertical: false,
    PictureLayerReversHorizontal: false,
    PictureLayerZIndex: 1000,
    PictureLayerTop: 0,
    PictureLayerLeft: 0,
    PictureLayerRight: 0,
    PictureLayerBottom: 0,

    ControlrClickEnabled: true,
    ControllClickEnabled: true,
    ControlmScrollEnabled: true,
    ControlKeyEnterEnabled: true,
    ControlKeyCtrlEnabled: true,
    ContorlAuto: false,
    ContorlSkip: false,
    ContorlRecordRead: true,


}
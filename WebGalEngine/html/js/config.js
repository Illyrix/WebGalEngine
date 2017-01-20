// 程序系统运行配置
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
    SettingReadTxtSpd: 120,
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
    MessageLayerBgColor: "rgba(103, 228, 197, 0.7)",
    MessageLayerVisible: false,
    MessageLayerOnLeftClick: function(){},
    MessageLayerOnRightClick: function(){},


    TextAreaText: "",
    TextAreaFont: {"font-family":"Hiragino Sans GB W3", "font-size":"28px", "font-weight":"bolder",
        "line-height":"30px", "text-shadow":"0px 0px 0.2em #45f",
        "-webkit-text-stroke":"0px #8df"},
    TextAreaColor: "#FFF",
    TextAreaTop: 0,
    TextAreaLeft: 0,
    TextAreaBottom: 0,
    TextAreaRight: 0,
    TextAreaWidth: "auto",
    TextAreaHeight: "auto",
    TextAreaBorder: {"border-width": "", "border-style": "none", "border-color": "transparent"},
    TextAreaBorderRadius: 0,
    TextAreaAutoMargin: false,
    TextAreaNoAnime: false,
    TextAreaOnLeftClick: function(){},
    TextAreaOnRightClick: function(){},
    TextAreaBgColor: "rgba(255, 255, 255, 0)",
    TextAreaBgImage: false,

    PictureLayerSrc: "",
    PictureLayerVisible: false,
    PictureLayerAlpha: 1,
    PictureLayerClip: {left:0, top:0, width:0, height:0, enable:false},
    PictureLayerScale: 1,
    PictureLayerReversVertical: false,
    PictureLayerReversHorizontal: false,
    PictureLayerZIndex: 0,
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

    AudioSrc: "",
    AudioSwitchTime: 2000,   // 音频切换过渡时间
    AudioSwitchStep: 50,
}
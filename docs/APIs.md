## EngineObject  
将调整窗口大小, 存取文件等功能等装在一个对象中暴露给 javascript
  1. EngineObject.fullScreenDisplay()   
    切换到全屏显示
  2. EngineObject.windowedDisplay(width, height)
    切换到窗口显示
    * **width** 窗口宽度, 默认 `1920`  
    * **height** 窗口高度, 默认 `1080`
  3. EngineObject.existsFile(relativePath)
    检查对应文件是否存在
    * **relativePath** 待检查文件相对于主程序的文件路径  
      以下三种表示均可:  
      `"./relative/path/file"`
      `"/relative/path/file"`
      `"relative/path/file"`
  4. EngineObject.readFile(relativePath)
    读取文件. 文件若不存在将会抛出 `No such file` 异常
    * **relativePath** 读取的文件相对于主程序的路径
      参数表示同 _EngineObject.existsFile_
  5. EngineObject.writeFile(relativePath, data, append)
    写入文件. 文件若不存在将会被创建.
    * **relativePath** 待写入的文件相对于主程序的路径  
      参数表示同 _EngineObject.existsFile_
    * **data** 待写入的字符串
    * **append** 是否追加写入, 默认为 `true`  
      如果设置为 `false` , 那么文件将会被清空并从头写入, 否则追加到文件末尾

## EngineUser  
包含用户设置的对象
  1. EngineUser.Scenario
    存储游戏流程控制命令  
    模块导出的应该是一个包含函数和有 label 属性的对象的数组. 参见使用示例  
    默认在 `app/scenario.js`
  2. EngineUser.Config
    程序系统运行配置  
    默认在 `app/config.js`
      1. EngineUser.Config.settingPath 存储设置的文件目录
      2. EngineUser.Config.savePath 存档目录
      3. EngineUser.Config.saveMainfest 存档清单(包含几个存档,存档的文件名等)
      4. EngineUser.Config.canvasRefresh canvas刷新间隔时间

  3. EngineUser.Default
    默认值设定  
    默认在 `app/config.js`  
    项目过多就不列举了, 命名方式是 `SettingBgmVolumn` 代表 `Engine.Setting.BgmVolumn`

## Engine
对主要功能的封装
  1. Engine.Init()  
    对整个对象进行初始化(一般在 `window.onload()` 中调用)  
    默认在 `core/Init.js`
  2. Engine.Vars  
    存储游戏过程中需要保存的变量  
    默认在 `core/Vars.js`  
    **不建议把原生对象或者层数过高或者有递归的对象存储下来(无法序列化写入文件)**
    * Engine.Vars.Global  
      在任何分支/周目都通用的变量, 比如周目几等  
      **注意系统设置在 Engine.Setting**
    * Engine.Vars.Local  
      会随着 save 操作保存进档案的对剧情有影响的变量
  3. Engine.Proc
    对游戏流程进行控制, 比如下一个场景或者跳转等  
    默认在 `core/Proc.js`
    * Engine.Proc.goto(label, setRead)  
      将流程跳转到指定 label  
        **label** 要跳转的 label  
        **setRead** 在跳转过程中设置跳转中间部分为已读(`true`)或者不做设置(`false`)
    * Engine.Proc.call(label, setRead)  
      同 _Engine.Proc.goto_, 但此种跳转可以用 `Engine.Proc.back()` 来返回跳转前的进度
    * Engine.Proc.back()  
      返回最近一次 `Engine.Proc.call()` 的地址, 若没有调用过 `Engine.Proc.call()` 则会抛出异常
    * Engine.Proc.next()  
      顺序前进到下个场景, 如果已经全部执行完毕, 返回 `true`, 否则返回 `false`
    * Engine.Proc.scenarios  
      存储分析后的 EngineUser.Scenario:  
      `[{label:"xx", index:5, func:callable},...]`  
      因为每一项要不是 label 要不是场景的函数, 所以每个场景 `label` 和 `func` 两个字段中有且只有一个
    * Engine.Proc.labels  
      存储 label 对应的场景下标:  
      `{"Label1":5, "Label4":88}`
    * Engine.Proc.read  
      记录场景是否已读的信息:  
      `[true, , , , true, true]`  
      此数组应该在 save 操作的时候保存/或者在 `Engine.Vars.Global` 中保存
    * Engine.Proc.callStack  
      保存 call 的调用栈, 在 save 的时候视情况保存或不保存  
      `[23, 56]`
    * Engine.Proc.pc  
      记录执行到哪一步(process counter)
  4. Engine.Setting  
    存储玩家的游戏设置  
    默认在 `core/Setting.js`
    * saveToFile()  
      将设置保存至文件  
    * loadFromFile()  
      从 `Engine.Config.settingPath` 的路径读入设置文件
    * loadFromDefault()  
      从 `EngineUser.Default.Setting***` 读入设置
    * bgmVolumn 背景音乐音量
    * spkVolumn 语音音量
    * effVolumn 效果音音量
    * readTxtSpd 已读文本显示速度
    * noReadTxtSpd 未读文本显示速度
    * autoModeSpd 自动模式文本显示速度
    * textNoDelay 文本是否立即显示(无动画)
    * isWindowed 是否以窗口化方式运行
    * skipNoRead 是否跳过未读文本
  5. Engine.Control  
    与用户操作相关的控制命令  
    默认在 `core/Control.js`
    * listSaves()  
      获取所有存档的列表, 返回是一个对象:  
      ```
      {
        "1":{
          "saveTime":1486893781588,
          "saveFile":"./save/1.json",
          "thumbFile":"./save/1.thumb"
        },
        ...
      }
      ```
      `saveFile` 是存档文件的存储地址, `thumbFile` 是缩略图的存储地址
    * save (id, title)
      存储存档到文件  
      **id** 存档编号  
      **title** 存档命名
    * load (id)
      读取存档并恢复当前环境到存档时  
      **id** 存档编号, 可从 `listSaves()` 中获得
    * wait (time, callable)  
      等待 `time` 毫秒, 并在此期间用户操作无效. 如果 `callable` 是函数的话则在延时完成之后调用  
      **time** 等待的时间, 单位: ms  
      **callable** 延时完成之后的回调
    * rClickEnabled 启用右键点击
    * lClickEnabled 启用左键点击
    * mScrollEnabled 启用中键滚轮
    * keyEnterEnabled 启用 Enter 键
    * keyCtrlEnabled 启用 Ctrl 键
    * onKeyEnter Enter 键摁下的回调(仅在 keyEnterEnabled 为 true 有效)
    * onKeyCtrl Ctrl 键摁下的回调(仅在 keyCtrlEnabled 为 true 有效)
    * onMScroll 鼠标中键滚动的回调(仅在 mScrollEnabled 为 true 有效)
    * recordRead 将当前阅读的文本自动标记为已读
    * auto 由 `false` 设置为 `true` : 开启自动模式. 由 `true` 设置为 `false` : 关闭自动模式
    * skip 由 `false` 设置为 `true` : 开启快进模式. 由 `true` 设置为 `false` : 关闭快进模式

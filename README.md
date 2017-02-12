A Gal Engine based on CEF.

## Document
* ### EngineObject   
对 javascript 无法实现的功能进行封装
  1. #### EngineObject.fullScreenDisplay()   
    切换到全屏显示
  2. #### EngineObject.windowedDisplay(width, height)
    切换到窗口显示
    * **width** 窗口宽度, 默认 `1920`  
    * **height** 窗口高度, 默认 `1080`
  3. #### EngineObject.existsFile(relativePath)
    检查对应文件是否存在
    * **relativePath** 待检查文件相对于主程序的文件路径  
      以下三种表示均可:  
      >"./relative/path/file"  
      "/relative/path/file"  
      "relative/path/file"

  4. #### EngineObject.readFile(relativePath)
    读取文件. 文件若不存在将会抛出 `No such file` 异常.
    * **relativePath** 读取的文件相对于主程序的路径  
      参数表示同 _EngineObject.existsFile_
  5. #### EngineObject.writeFile(relativePath, data, append)
    写入文件. 文件若不存在将会被创建.
    * **relativePath** 待写入的文件相对于主程序的路径  
      参数表示同 _EngineObject.existsFile_
    * **data** 待写入的字符串
    * **append** 是否追加写入, 默认为 `true`  
      如果设置为 `false` , 那么文件将会被清空并从头写入, 否则追加到文件末尾
* ### EngineUser
包含用户设置的对象
  1. #### EngineUser.Scenario
    存储游戏流程控制命令  
    Usage:
    ```
    (function(){
        var temp_var = true;
        EngineUser.Scenario = EngineUser.Scenario.concat(
            new Array(
                function(){console.log("step0"); Engine.Control.wait(1500, function(){
                    console.log(Engine.Control);
                    });},
                function(){Engine.Proc.goto("CH1");console.log("step1");},
                {label:"CH0"},  // 设置标签CH0
                function(){
                    temp_var = false;
                    console.log("step2");
                    Engine.Proc.goto("CH2");
                },
                {label:"CH1"},
                function(){console.log("step3")},
                function(){
                    temp_var = true;
                    console.log("step4");
                },
                {label:"CH2"},
                function(){
                    console.log("step5");
                    if (temp_var) Engine.Proc.goto("CH0");
                },
                function(){console.log("step6");}
            )
        );
    }())
    ```
  2. #### EngineUser.Config
    程序系统运行配置
      1. EngineUser.Config.settingPath 存储设置的文件目录
      2. EngineUser.Config.savePath 存档目录
      3. EngineUser.Config.saveMainfest 存档清单(包含几个存档,存档的文件名等)
      4. EngineUser.Config.canvasRefresh canvas刷新间隔时间

  3. ### EngineUser.Default
    默认值设定  
    项目过多就不列举了, 命名方式是 `SettingBgmVolumn` 代表 `Engine.Setting.BgmVolumn`

* ### Engine
对主要功能的封装
  1. #### Engine.init()
    对整个对象进行初始化(一般在 `window.onload()` 中调用)
  2. #### Engine.Vars
    存储游戏过程中需要保存的变量
    * ##### Engine.Vars.Global
      在任何分支/周目都通用的变量, 比如周目几等  
      **注意系统设置在Engine.Setting**
    * ##### Engine.Vars.Local
      会随着 save 操作保存进档案的对剧情有影响的变量
    * ##### Engine.Vars.Temp
      存储临时变量, 每次load操作/重启之后会清空
  3. #### Engine.Proc
    对游戏流程进行控制, 比如下一个场景或者跳转等
    * ##### Engine.Proc.init()
      初始化工作, 确定 label 的位置等, 将会在 `Engine.init()` 中被调用  
    * ##### Engine.Proc.goto(label, setRead)
      将流程跳转到指定 label  
        **label** 要跳转的 label  
        **setRead** 在跳转过程中设置跳转中间部分为已读(`true`)或者不做设置(`false`)
    * ##### Engine.Proc.call(label, setRead)
      同 _Engine.Proc.goto_, 但此种跳转可以用 `Engine.Proc.back()` 来返回跳转前的进度
    * ##### Engine.Proc.back()
      返回最近一次 `Engine.Proc.call()` 的地址, 若没有调用过 `Engine.Proc.call()` 则会抛出异常.
    * ##### Engine.Proc.next()
      顺序前进到下个场景, 如果已经全部执行完毕, 返回 `true`, 否则返回 `false`
    * ##### Engine.Proc.scenarios
      存储分析后的 EngineUser.Scenario:  
      `[{label:"xx", index:5, func:callable},...]`  
      因为每一项要不是 label 要不是场景的函数, 所以每个场景 `label` 和 `func` 两个字段中有且只有一个
    * ##### Engine.Proc.labels
      存储 label 对应的场景下标:  
      `{"Label1":5, "Label4":88}`
    > Engine.Proc.labels 和 Engine.Proc.scenarios 均在 Engine.Proc.init() 中被初始化

      * ##### Engine.Proc.read
        记录场景是否已读的信息:  
        `[true, , , , true, true]`  
        此数组应该在 save 操作的时候保存/或者在 `Engine.Vars.Global` 中保存
      * ##### Engine.Proc.callStack
        保存 call 的调用栈, 在 save 的时候视情况保存或不保存  
        `[23, 56]`
      * ##### Engine.Proc.pc
        记录执行到哪一步(process counter)
  4. ####

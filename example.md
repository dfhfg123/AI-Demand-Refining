数据结构
BizyModel & BizyModelVersion 
type BizyModel struct {
    common.Model
    UserId     string                 `gorm:"size:255;index:idx_user_id_type,priority:2"`
    Name       string                 `gorm:"size:255"`
    // WebApp使用新的type=Application
    Type       string                 `gorm:"size:255;index:idx_user_id_type,priority:1"`
    ParentId   int64                  `gorm:"index:idx_parent_id;default:0"`
    IsOfficial common.BoolOrIntString `gorm:"type:tinyint(1);column:is_official;default:0"`
    Tags       common.ListString      `gorm:"type:json"`
}

type BizyModelVersion struct {
    common.Model
    UserId          string                 `gorm:"size:32;index"`
    BizyModelId     int64                  `gorm:"size:32;index"`
    ModelId         int64                  `gorm:"size:32"`
    ModelFileId     int64                  `gorm:"size:32;index"`
    Version         string                 `gorm:"size:255"`
    BaseModel       string                 `gorm:"size:255"`
    Intro           string                 `gorm:"type:text"`
    Sign            string                 `gorm:"size:64"`
    Path            string                 `gorm:"size:255"`
    Ext             string                 `gorm:"size:100"`
    Public          common.BoolOrIntString `gorm:"type:tinyint(1);default:0"`
    ParentId        int64                  `gorm:"size:32;default:0"`
    OriginalUserId  string                 `gorm:"size:32"`
    UsedCount       int64                  `gorm:"default:0"`
    ForkedCount     int64                  `gorm:"default:0"`
    LikedCount      int64                  `gorm:"default:0"`
    DownloadedCount int64                  `gorm:"default:0"`
    CoverUrls       common.ListString      `gorm:"type:json"`
    Locked          common.BoolOrIntString `gorm:"type:tinyint(1);default:0"`
    ReviewState     int32                  `gorm:"default:0;index"`
    ReviewResult    string                 `gorm:"size:700"`
    ReviewedAt      common.NullTime
    ReviewRetries   int32             `gorm:"default:0"`
    Tags            common.ListString `gorm:"type:json"`
    ApiKey          string            `gorm:"size:255"`
    
    //Add on Webapp Version
    //标识发布自哪个画布，type=Application的必有，type=workflow的可能有，type不是这两类的没有
    DraftId  int64 `gorm:"size:32"`
    //仅type=Application的有值，标识关联对应的WorkflowId
    WorkflowId int64 `gorm:"size:32"`
    //仅type=Application的有值，是Workflow-Api Template的objectKey
    WebAppPromptContentTpl string `gorm:"size:255"`
    
    // Add on MCP Version
    // 仅type=Application的有值，标识关联对应的mcpId
    McpId int64 `gorm:"size:32"` 
}
Mcp
与BizyModelVersion type=Application 是 1:1 的
type Mcp struct {
    common.Model
    BizyModelId        int64                  `gorm:"column:bizy_model_id;"`                                         // 关联的AI应用的BM，不可修改
    BizyModelVersionId int64                  `gorm:"column:bizy_model_version_id;index:idx_bizy_model_version_id;"` // 关联的AI应用的BMV，不可修改
    UserId             string                 `gorm:"column:user_id;not null;type:varchar(255);"`                    // 发布者，不可修改
    Name               string                 `gorm:"column:name;not null;type:varchar(500);"`                       // mcp名称，默认与AI应用同名，可修改
    ConfigName         string                 `gorm:"column:config_name;type:varchar(100);"`                         // 会在mcp config json中配置的mcp name，可修改
    Description        string                 `gorm:"column:description;type:text;"`                                 // mcp详情，支持markdown，可修改
    Intro              string                 `gorm:"column:intro;type:text;"`                                       // mcp简要描述（展示在列表页和详情页标题下方），可修改
    Icon               string                 `gorm:"column:icon;type:varchar(500);"`                                // mcp logo, 默认就是bizyair的logo，可修改
    Public             common.BoolOrIntString `gorm:"type:tinyint(1);default:0"`                                     // 是否公开，可修改，但不能出现mcp公开bmv私有的情况
    ApiKey             string                 `gorm:"size:255"`                                                      // INTERNAL USE ONLY DONT EXPOSE TO USER
    ParentId           int64                  `gorm:"size:32;default:0"`                                             // parentId>0 代表是fork的，此列存的是父mcp.id，不可修改
    OriginalUserId     string                 `gorm:"size:32"`                                                       // parentId>0时，记录源mcp的userId，不可修改
    ForkedCount        int64                  `gorm:"default:0"`                                                     // 被克隆数，自动更新
    LikedCount         int64                  `gorm:"default:0"`                                                     // 被点赞数，自动更新
    UsedCount          int64                  `gorm:"default:0"`    
    Enabled            bool                   `gorm:"column:enabled;"                             // mcp tool是否可用                                                        // 调用次数，自动更新
}

func (Mcp) GetDB() *gorm.DB {
    return BizDB
}
McpTool
MCP关联的tools，MCP <---1：N ---> MCP Tool
type McpTool struct {
    common.Model
    McpId              int64  `gorm:"column:mcp_id;"`                             // 关联的MCP，不可修改。用于ES定位
    BizyModelId        int64  `gorm:"column:bizy_model_id;"`                      // 关联的AI应用的BM，不可修改
    BizyModelVersionId int64  `gorm:"column:bizy_model_version_id;index;"`        // 关联的AI应用的BMV，不可修改
    UserId             string `gorm:"column:user_id;not null;type:varchar(255);"` // 发布者，不可修改
    Name               string `gorm:"column:name;not null;type:varchar(500);"`    // mcp tool的名称，如generate_image，可修改
    Intro              string `gorm:"column:intro;type:text;"`                    // mcp tool的描述 支持markdown，可修改
}

func (McpTool) GetDB() *gorm.DB {
    return BizDB
}
McpToolProperty
Mcp Tool 关联的参数信息，MCP Tool <---1：N ---> MCP Tool Property
type McpToolProperty struct {
    common.Model
    BizyModelVersionId int64                               `gorm:"column:bizy_model_version_id;index;"`             // 关联的AI应用的BMV，不可修改
    McpToolId          int64                               `gorm:"column:mcp_tool_id;not null;index;"`              // 关联的mcp tool，不可修改
    UserId             string                              `gorm:"column:user_id;not null;type:varchar(255);"`      // 创建者，不可修改
    InputNodeId        int64                               `gorm:"column:input_node_id;not null;index;"`            // 对应的inputNode，不可修改
    FieldLabel         string                              `gorm:"column:field_label;not null;"`                    // 对应的inputNode.fieldLabel，不可修改，从input node同步
    VariableName       string                              `gorm:"column:variable_name;"`                           // 变量名，自动生成，不可修改
    VariableType       WebApplicationInputNodeVariableType `gorm:"column:variable_type;type:varchar(10);not null;"` // 变量类型，不可修改
    VariableDesc       string                              `gorm:"column:variable_desc;not null;"`                  // 变量描述，可修改
    Required           bool                                `gorm:"column:required;not null;default:false;"`         // 是否必填，可修改
}

func (McpToolProperty) GetDB() *gorm.DB {
    return BizDB
}

type WebApplicationInputNodeVariableType string

const (
    WebApplicationInputNodeVariableTypeString  WebApplicationInputNodeVariableType = "string"
    WebApplicationInputNodeVariableTypeNumber  WebApplicationInputNodeVariableType = "number"
    WebApplicationInputNodeVariableTypeBoolean WebApplicationInputNodeVariableType = "boolean"
)
BMV和MCP的关系是不求同生但求同死
- BMV的产生不会伴随MCP的产生，但是BMV的删除会连带删除MCP
- 反过来，MCP的发布依赖BMV存在，MCP的删除不连带删除BMV
接口
改造BizyModelVersion详情
根据以下逻辑，补充返回mcp_id
- 如果是从“AI应用”列表点进详情页的，判断mcp_id>0。如为true，判断当前用户是否有权访问所关联mcp（mcp公开或发布人为当前用户），如果无权访问，将mcp_id设置为0
- 如果是从“我的”列表点进详情页的，无需判断直接返回mcp_id
改造修改BizyModelVersion
修改type=Application的BizyModelVersion时，需要额外处理mcp。
当AI应用的新input_nodes和旧input_nodes相比，发生了成员变化，需要做以下处理：
- 在response中返回 mcp_outdated: int32字段，反应新input_nodes的变化，
  - 前端收到响应时
    - 如mcp_outdated=0, 表示新旧input_nodes一致，mcp无需变更
    - 如mcp_outdated=1，表示input_nodes只多了成员，应弹出confirm提示：
      您的 MCP 配置已过期，继续使用可能会导致功能异常或数据不同步。
      立即更新可确保所有功能正常运行。
      [前往更新]   [稍后再说]
      - 点击前往更新，跳转到mcp修改表单页面
    - 如mcp_outdated=2，表示input_nodes只少了成员，应弹出confirm提示：
      您的 MCP 配置已被自动更新。
      [我要检查]   [稍后再说]
      - 点击前往查看，跳转到mcp修改表单页面
      - 新的input_nodes里少了成员：后端根据缺少的variable_name，自动删除mcp里对应的mcp_tool_property
    - 如mcp_outedated=3，表示input_nodes同时发生了成员增删，和1的处理一致
- 更新AI应用时，检查关联的MCP.enabled，每个mcpTool是否所有property都有非空tooltips，如果是，设置MCP.enabled=true
- MCP与AI应用的可见性保持一致，即：要么都公开，要么都私有
  - MCP无法单独设置公开私有，而是根据它所关联的AI应用的public而定
改造删除BizyModelVersion
删除type=Application的BizyModelVersion时，需要额外处理mcp。
删除BMV（BM），连带删除mcp_id对应的mcp记录，以及mcp_tools、mcp_tool_property记录，注意事务

MCP列表
GET /mcp_servers/:mode?keyword=xxx
RequestParam
- 路径参数 
  - mode，必填，枚举：
    - my 我的
    - my_fork 我克隆的
    - publicity 社区
- query参数
  - keyword
    - 搜索关键字，非必填，需要urlencode
  - 分页参数
    - current、page_size
  - 排序参数，枚举：
    - Recently  按发布时间倒排
    - Most Called 按调用数倒排
    - Most Forked 按克隆数倒排
    - Most Liked 按点赞数倒排
Response Body
{
    // 省略了分页字段
    "list": [
        {
            "id": 123,
            "bizy_model_id": 23,
            "bizy_model_version_id": "123",
            "name": "文字生成图像",
            "config_name": "text-to-image-mcp",
            // intro比较大，列表页不需要
            "intro": "一个轻量级的MCP Server，可以通过提示词生成图片",
            "icon": "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/img/20250310/p3tqfe1o62WUCbFjcOWUk9n2dlCXyCB6.webp",
            "public": true,
            "enabled": true,
            "counter": {
                "forked_count": "10k",
                "liked_count": "100",
                "called_count": "20k" // sum all tool.called_count
            },
            "parent_id": 0, // 是否是fork的
            //根据user_id补齐
            "user_id": "clzc4iqoe004nlhdg30juab85",
            "user_name": "lij",
            "user_avatar": avatar_url,
            "user_intro": "一个老男人"，
            // 如果是forked，会额外有以下字段
            "original_user_id": "",
            "original_user_name": "",
            "original_user_avatar": "",
            "original_user_intro": "",
            // mcp server实际地址，由后端动态拼接而成，就是配置字段拼上id
            "url": "https://api.bizyair.cn/w/v1/mcp/123",
            "created_at": "2025-07-17 17:38:30", // 发布日期
            "updated_at": "2025-07-17 17:38:30", // 更新日期
            // mcp tools
            "tools": [
                {
                    "id": 131,
                    "name": "generate_image",
                    "intro": "根据提示词生成图片，返回图片url链接",
                    "called_count": "20k", // 从redis读取
                    "properties": [
                        {
                            "id": 411,
                            "field_label": "正向提示词",
                            "variable_name": "3.ClipTextEncoder.prompt",
                            "variable_type": "string",
                            "variable_desc": "提示词",
                            "required": true
                        },
                        {
                            "id": 412,
                            "field_label": "seed",
                            "variable_name": "4.KSampler.seed",
                            "variable_type": "number",
                            "variable_desc": "random seed",
                            "required": true
                        },
                        {
                            "id": 413,
                            "field_label": "auto_resize_image",
                            "variable_name": "5.ImageStitch.auto_resize_image",
                            "variable_type": "bool",
                            "variable_desc": "是否自动修改图片尺寸",
                            "required": true
                        },
                        ......
                    ]
                }，
            ......
            ],
        }
    ]
}
- keyword关键字的检索范围是mcp.name和mcp.description，需走ES
- mode=publicity时，筛选enabled=true AND public=true 的mcp

获取MCP详情
GET /mcp_server/:id/detail
Request Param
Id：mcpId
Response Body
{
    "id": 123,
    "bizy_model_id": 23,
    "bizy_model_version_id": "123",
    "name": "文字生成图像",
    "config_name": "text-to-image-mcp",
    "intro": "一个轻量级的MCP Server，可以通过提示词生成图片",
    "description": "#1/n一个轻量级的基于Python的MCP（模型上下文协议）服务器，能够通过AI代理请求与本地的ComfyUI实例进行图像生成的接口。#2/n概述/n/n该项目使AI代理能够通过WebSocket使用MCP协议向ComfyUI发送图像生成请求。它支持：......"
    "icon": "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/img/20250310/p3tqfe1o62WUCbFjcOWUk9n2dlCXyCB6.webp",
    "public": true,
    "enabled": true,
    "counter": {
        "forked_count": "10k",
        "liked_count": "100",
        "called_count": "20k" // sum all tool.called_count
    },
    "parent_id": 0, // 是否是fork的
    //根据user_id补齐
    "user_id": "clzc4iqoe004nlhdg30juab85",
    "user_name": "lij",
    "user_avatar": avatar_url,
    "user_intro": "一个老男人"，
    
    // 如果是forked，会额外有以下字段
    "original_user_id": "",
    "original_user_name": "",
    "original_user_avatar": "",
    "original_user_intro": "",
    
    // mcp server实际地址，由后端动态拼接而成，就是配置字段拼上id
    "url": "https://api.bizyair.cn/w/v1/mcp/123",
    "created_at": "2025-07-17 17:38:30", // 发布日期
    "updated_at": "2025-07-17 17:38:30", // 更新日期
    "forked": false,  // 是否复制过
    "liked": false, // 是否点赞过
    // mcp tools
    "tools": [
        {
            "id": 131,
            "name": "generate_image",
            "intro": "根据提示词生成图片，返回图片url链接",
            "called_count": "20k", // 从redis读取
            "properties": [
                {
                    "id": 411,
                    "input_node_id": 10,
                    "field_label": "正向提示词",
                    "variable_name": "3.ClipTextEncoder.prompt",
                    "variable_type": "string",
                    "variable_desc": "提示词",
                    "required": true
                },
                {
                    "id": 412,
                    "input_node_id": 11,
                    "field_label": "seed",
                    "variable_name": "4.KSampler.seed",
                    "variable_type": "number",
                    "variable_desc": "random seed",
                    "required": true
                },
                {
                    "id": 413,
                    "input_node_id": 12,
                    "field_label": "auto_resize_image",
                    "variable_name": "5.ImageStitch.auto_resize_image",
                    "variable_type": "bool",
                    "variable_desc": "是否自动修改图片尺寸",
                    "required": true
                },
                ......
            ]
        }，
        
        ......
    ],
}
发布MCP
入口在AI应用的详情页（从“我发布的”or “我克隆的”点进来的才有）
POST /mcp_server/create
“发布MCP Server”的按钮，只会出现在“我发布的”、“我收藏的”列表点出的AI应用的详情页中，按钮出现条件是：
1. BMV类型是AI应用
2. BMV的发布者是当前用户
  1. 如果BMV是fork的，则发布者已经变为操作fork的用户了，也适用此条件
3. BMV的mcp_id=0
  1. 如果mcp不存在，则为0
  2. 如果mcp存在，mcp与AI应用的public必然一致，mcp_id>0，此时不能再发布mcp
    1. fork的AI应用，如果有mcp，也会自动fork mcp。
Request Param
{
    "bizy_model_id": 23, // 关联的bm.id
    "bizy_model_version_id": 123, // 关联的bmv.id
    "name": "文字生成图像", // MCP名称，用户填写
    "config_name": "text-to-image-mcp", // MCP Server名称，“-mcp”这段固定，前面允许a-zA-z0-9和-，用户填写，可重复
    // MCP概要, 用户填写
    "description": "#1/n一个轻量级的基于Python的MCP（模型上下文协议）服务器，能够通过AI代理请求与本地的ComfyUI实例进行图像生成的接口。#2/n概述/n/n该项目使AI代理能够通过WebSocket使用MCP协议向ComfyUI发送图像生成请求。它支持：......"
    "intro": "一个轻量级的MCP Server，能够通过提示词生成图片",
    "icon": url, // 默认值bizyair icon url，后期考虑让用户上传，或者自动生成
    "public": true, // 是否公开，用户选，默认值与AI应用的public一致
    "tools": [
        {
            "name": "generate_image",
            "intro": "根据提示词生成图片，返回图片url链接",
            "called_count": "20k",
            "properties": [
                {
                    "input_node_id": 10, 
                    "variable_type": "string",
                    "variable_desc": "提示词",
                    "required": true
                },
                {
                    "input_node_id": 11,
                    "variable_type": "number",
                    "variable_desc": "random seed",
                    "required": false
                },
                {
                    "input_node_id": 12,
                    "variable_type": "bool",
                    "variable_desc": "是否自动修改图片尺寸",
                    "required": false
                },
                ......
            ]
        }，
        ......
    ],
}
Response Body
{
    "mcp_id": mcp.id,
    "bizy_model_id": bm.id,
    "bizy_model_version_id": bmv.id
}
表单项及要求
- MCP名称：name，允许中文，50字内，必填
- MCP Server名称：config_name，“-mcp”这段固定，前面允许a-zA-z0-9和-，可重复，必填
- 概要：description，支持markdown，必填， 5000字
- 简要描述：intro，非必填，100字。（后期考虑让LLM基于description 自动总结）
- 图标（不展示）：icon, 不让选，先写死bizyair的图标；后期考虑可以上传或自动生成
- 是否公开：public，页面上展示AI应用的public，但disabled。加问号图标，气泡文案：“MCP的可见性与AI应用保持一致”
- Tools 数组
  - 方法名称：name，只允许小写英文与下划线，默认值generate_image，100字内，必填
  - 方法描述：intro，允许markdown，300字内，必填
  - 方法参数：数组
    - 参数名称（仅展示）：input_node.field_label
    - 参数描述：variable_desc，用户填写，默认值为input_node.field_tooltip，必填，前端要trim后再validate是否为空
    - 是否必填：required，默认false，必填
    - 隐藏参数（都要传）
      - 参数类型：variable_type：根据input_node.field_type确定前端组件，然后对应到[string, number, boolean]三者之一 后端根据input_node的variable_type来决定
      - 对应的input_node.variable_name：variable_name
后端逻辑
mcpId
- 一个BMV只有一个MCP，是1:1的。因此发布时需校验是否有BMV.mcpId == 0。
  - 如果存在mcpId，则报错“MCP Server已存在，请先删除后再重新发布！”
  - 如果不存在mcpId，执行插入mcp、mcp_tools、mcp_tool_property，同时更新BMV.mcpId，注意事务
  - 检查mcp_tools的tooltips是否都不为空，如果是，mcp.enabled=true
counters
- 目前有called_count，forked_count，liked_count，即mcp server被调用次数
- 可以仿照 bizy_model_version_counter/counter.go 的逻辑，新写一个mcp/counter.go，替换redis key和相关表的操作、报错信息等，可以共用一个InitSyncCounter入口。
更新MCP
入口在MCP的详情页
PUT /mcp_server/:id
“更新MCP Server”的按钮，只会出现在“我发布的”点出的MCP的详情中，按钮点亮条件是：
1. BMV类型是AI应用
2. BMV的发布者是当前用户
  1. 如果BMV是fork的，则发布者已经变为操作fork的用户了，也适用此条件
3. BMV的mcp_id != 0
  1. 如果mcp不存在，则为0
  2. 如果mcp存在，则mcp_id>0
4. parent_id = 0
  1. Forked mcp 不能修改，禁用更新按钮，提示“该MCP是复刻的，不可修改”
Request Param
{
    "id": 1, // mcp.id
    "bizy_model_id": 23, // 关联的bm.id
    "bizy_model_version_id": 123, // 关联的bmv.id
    "name": "文字生成图像", // MCP名称，用户填写
    "config_name": "text-to-image-mcp", // MCP Server名称，“-mcp”这段固定，前面允许a-zA-z0-9和-，用户填写，可重复
    // MCP概要, 用户填写
    "description": "#1/n一个轻量级的基于Python的MCP（模型上下文协议）服务器，能够通过AI代理请求与本地的ComfyUI实例进行图像生成的接口。#2/n概述/n/n该项目使AI代理能够通过WebSocket使用MCP协议向ComfyUI发送图像生成请求。它支持：......"
    "intro": "一个轻量级的MCP Server，可以通过提示词生成图片",
    "icon": url, // 默认值bizyair icon url，后期考虑让用户上传，或者自动生成
    "public": true, // 是否公开，用户选，默认值与AI应用的public一致
    "tools": [
        {
            "id": 131,
            "name": "generate_image",
            "intro": "根据提示词生成图片，返回图片url链接",
            "called_count": "20k",
            "properties": [
                { 
                    "input_node_id": 10,
                    "variable_type": "string",
                    "variable_desc": "提示词",
                    "required": true
                },
                {
                    "input_node_id": 11,
                    "variable_type": "number",
                    "variable_desc": "random seed",
                    "required": false
                },
                {
                    "input_node_id": 12,
                    "variable_type": "bool",
                    "variable_desc": "是否自动修改图片尺寸",
                    "required": false
                },
                ......
            ]
        }，
        ......
    ],
}
Response Body
{
    "mcp_id": mcp.id,
    "bizy_model_id": bm.id,
    "bizy_model_version_id": bmv.id
}
后端逻辑
- 对于mcp_tools 与 AI应用的input_nodes是完全对齐的，所以增删input_nodes，只能改元信息（variable_name和required）
- 判断所有tooltips是否都不为空，如果是，则mcp.enabled=true
- 注意事务
删除MCP
入口在MCP详情页（从“我发布的”点进去）
DELETE /mcp_server/:id
“删除” 按钮只会出现在“我的”点出的MCP详情页中。
只允许用户删除自己发布过的MCP（不校验public）
Response 
200
后端逻辑
- 注意级联删除 mcp_tools, mcp_tool_property表，以及修改关联的BVM.mcp_id = 0，注意事务

改造BizyModelVersion的克隆/取消克隆逻辑
MCP与AI应用是一对一的，因此不能只克隆MCP，而不管AI应用。
克隆MCP，本质上就是克隆AI应用。AI应用详情页上的“克隆”逻辑也会克隆关联的公开的MCP
所以，需要改造BMV的fork/unfork逻辑，加入mcp的逻辑
克隆BMV
对于type=Application的BizyModelVersion，在执行克隆时：
1. 先执行BMV标准的克隆逻辑，创建forked BMV，
  1. 注意抹掉forked BMV的mcpId
2. 查询Original bmv.mcpId的mcp，
  1. 若私有，跳过mcp克隆操作
  2. MCP克隆逻辑
    1. 拷贝mcp、mcp_tools、mcp_tool_property记录，
    2. 重新构建forked mcp与forked BMV的1:1关联。
    3. 替换user_id，apikey
    4. 设置OriginalUserId，ParentId=原mcp.id
    5. forked mcp应设置为私有。因为forked BMV是私有的。
    6. INCR 原mcp forked计数器
    7. 继承原mcp的enabled
取消克隆BMV
对于type=Application的BizyModelVersion，在执行取消克隆时：
1. 先执行BMV标准的unfork逻辑，在删除forked BMV时：
  1. 关联删除forked BMV.mcp_id对应的mcp、mcp_tools、mcp_tool_property
Fork可能存在比较复杂的情况
- 原BMV 和 MCP 都存在 => Forked BMV + Forked MCP
- 原BMV 存在，MCP不存在 => 只有 Forked BMV
  - 后续原作者又发布了MCP，不处理，需要用户先unfork再重新fork
  - 如果用户自己为forked BMV发布了MCP，此时原作者也发布了MCP，那么
    - 原BMV => 原作者MCP，Forked BMV => 用户自己的MCP
- 因此MCP也需要能单独fork/unfork

克隆MCP
mcp的克隆就是AI应用的克隆，不需要专门的接口了
POST /mcp_servers/:id/fork
Request Param
路径参数 mcpId
Response Body
200
后端逻辑
- 先验证用户是否具备对该mcp的fork权限（MCP公开且发布人不是当前用户）
- 查询该mcp所关联的BMV是否已经被当前用户fork过了
  - 如果有，再检查forked BMV.mcpId，
    - 如果forked BMV.mcpId == 0，执行MCP克隆的逻辑
    - 如果forked BMV.mcpId > 0，报错“您收藏的AI应用已存在MCP Server，无法进行复制”
  - 如果没有，执行fork BMV的整套逻辑即可

取消克隆MCP
mcp的取消克隆就是AI应用的克隆，不需要专门的接口了
POST /mcp_servers/:id/unfork
Request Param
路径参数 mcpId
Response Body
200
后端逻辑
- 先根据mcpId查出的mcp，判断是原始mcp还是forked mcp
- 原始mcp
  - 查找用户是否fork过，"parent_id = mcpId and user_id = ?"
    - 如果没有，报错“您还没有复制过这个MCP Server”
    - 如果有，删除forked MCP，同时清理forked BMV.mcpId
- Forked mcp
  - 删除forked MCP，同时清理forked BMV.mcpId

点赞/取消点赞MCP
POST /mcp_servers/:id/like
Request Param
路径参数 mcpId
Response Body
200
后端逻辑
查询bizy_user_likes表，where bizy_type="mcp_server" AND object_id=mcp.id AND user_id=?
- 如果已存在记录，删除（取消点赞），不需要decr liked_count
- 如果不存在记录，插入，并增加liked_count
mcp被点赞，需要给mcp的发布者 发送消息，使用新的消息模板（低优）


MCP Server核心逻辑
我们希望用户这样使用我们提供的MCP服务
在MCP client（如cursor）中配置mcp.json，添加如下配置段落：
{
  "mcpServers": {
    "xxxxxxx-mcp": {
      "url": "https://api.bizyair.cn/w/v1/mcp/:id",
      "headers": {
          "Authorization": "Bearer YOUR-API-KEY"
      }
    }
  }
}
- Xxxxxxx-mcp 为mcp server配置名称，对应为mcp表记录的config_name，以-mcp结尾
- https://api.bizyair.cn/w/v1/mcp/:id 前半段是固定的，:id为mcp表记录的id
我们只提供Streamable HTTP 规范的使用方法
https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
Streamable HTTP 是 MCP 协议中用于客户端与服务器通信的一种标准传输方式，支持多客户端连接和流式消息传递。其核心是通过一个 HTTP 端点（如 https://example.com/mcp）同时支持 POST 和 GET 方法，结合 Server-Sent Events (SSE) 实现消息流。
以下是满足Streamable要求的两个接口
MCP
GET /mcp/:id
客户端监听服务器消息
- 客户端可通过 HTTP GET 请求 MCP 端点，建立 SSE 流以接收服务器主动推送的消息。
- GET 请求头需包含 Accept: text/event-stream。
- 服务器响应方式：
  - 返回 Content-Type: text/event-stream，建立 SSE 流，服务器可推送 JSON-RPC 请求和通知（与客户端主动请求无关）。
  - 或返回 405 Method Not Allowed，表示不支持 SSE。
- SSE 流可由服务器或客户端随时关闭。
- 服务器不得在此流中发送 JSON-RPC 响应，除非是恢复之前中断的流。
POST /mcp/:id
客户端发送消息到服务器
- 客户端每发送一条 JSON-RPC 消息，必须新建一次 HTTP POST 请求到 MCP 端点。
- POST 请求头需包含 Accept: application/json, text/event-stream 或*/*。
- 请求体必须是单个 JSON-RPC 请求、通知或响应。
- 服务器处理 POST 的响应方式：
  - 如果是 JSON-RPC 通知或响应，服务器接受后返回 202 Accepted，无响应体；无法接受则返回 4xx 错误码，可带 JSON-RPC 错误响应体（无 id）。
  - 如果是 JSON-RPC 请求，服务器response必须返回：
    - Content-Type: text/event-stream（开启 SSE 流），或
    - Content-Type: application/json（直接返回 JSON 对象）。
  - SSE 流中，服务器应最终发送与该请求对应的 JSON-RPC 响应，并可在此之前发送与该请求相关的 JSON-RPC 请求或通知。响应后应关闭 SSE 流。
  - 断开连接不等于取消请求，客户端如需取消应显式发送 CancelledNotification。
- 所有请求需带 MCP-Protocol-Version 头，指定协议版本，我们需支持"2025-03-26", "2025-06-18"。
我们的逻辑
- 在调用任何method前，都要先校验用户有没有使用此mcp的权限（mcp公开或当前用户是mcp的发布者）
- 我们需要校验mcp是否可用，enabled=true。如不可用提示“MCP配置过时或不完整，请您补充信息后再使用”
- 支持method
  - initialize
  - tools/list
  - tools/call
- method=tools/list，返回由mcpId相关的mcp_tools、mcp_tool_property组装的json
{
  "tools": [
    {
      "name": "generate_image",
      "description": "This tool is used to generate an image from a text prompt.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "3.EmptyLatent.height": {
            "description": "The size of the image to generate. The value should be one of the following: '1024x1024', '512x1024', '768x512'. If not provided, the default size will be '1024x1024'.",
            "type": "number"
          },
          "3.EmptyLatent.width": {
            "description": "The model to use to generate the image.",
            "type": "number"
          },
          "4.ClipTextEncoder.prompt": {
            "description": "The text prompt to generate the image from.",
            "type": "string"
          },
          "5.KSampler.seed": {
            "description": "The seed to generate the image from. If not provided, a random seed will be used.",
            "type": "number"
          }
        },
        "required": [
          "prompt"
        ]
      },
      "annotations": {
        "readOnlyHint": false,
        "destructiveHint": true,
        "idempotentHint": false,
        "openWorldHint": true
      }
    }
  ]
}
- method=tools/call
  - Request Param
{
  "method": "tools/call",
  "params": {
    "name": "generate_image",
    "arguments": {
      "4.ClipTextEncoder.prompt": "1girl",
      "5.KSampler.seed": 22222
    },
    "_meta": {
      "progressToken": 1
    }
  }
}
  - Response Body
{
  "content": [
    {
      "type": "text",
      // 返回cdnUrl
      "text": "https://sc-maas.oss-cn-shanghai.aliyuncs.com/outputs%2F20250721%2Fptwpvd53dq.png?Expires=1753070617&OSSAccessKeyId=LTAI5tQnPSzwAnR8NmMzoQq4&Signature=1jXL%2FJOMpsVhMMmK91lOD51SHwg%3D"
    }
  ]
}
  - tools/call本质上是调用AI应用的API接口（同步模式），因此需复用部分API模式的task/create接口代码
- 任何mcp接口报错，响应体都需要遵循jsonrpc的规范
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602, // jsonrpc errcode
    "message": "Unsupported protocol version",
    "data": { // data中提供有用信息
      "supported": ["2024-11-05"],
      "requested": "1.0.0"
    }
  }
}
JSON-RPC规范
- JSON-RPC规范
  1. 基本要求 
    - 使用 JSON 作为数据格式，支持多种传输方式（如 HTTP、Socket）。
    - 所有字段名区分大小写。
  2. 请求对象字段 
[图片]
    - 通知：不包含 id 字段的请求为通知，服务端不返回响应。
  3. 响应对象字段 
[图片]
    - result 和 error 不能同时出现，必须有且仅有一个。
  4. 错误对象字段
[图片]
  5. 批量调用 
  - 可发送请求对象数组，实现批量调用。
  - 响应为响应对象数组，顺序不限，通过 id 匹配。
  - 批量中所有通知的请求，不返回任何响应。
UI参考图
社区页
左侧增加MCP菜单
[图片]
滚动分页。鼠标hover到一项上，有动画效果，可参考
https://mcpmarket.com/zh/server
详情页
[图片]
图上未标明，从“我的”进入时出现“修改”、“删除”按钮
[图片]
[图片]
[图片]
表单页
[图片]
参考链接
https://mcpmarket.cn/server/67e5dc4c48048b1e353cbda9
https://smithery.ai/playground
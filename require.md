
我要做一个项目，其功能是用ai总结简化产品给的需求文档，
背景是，当开发一个版本需求时产品一般产品会给一个很长很繁琐的需求文档，他可能从许多视角阐述了这个版本需求，例如产品，用户，后端接口，原型设计，但最终对于前端开发者来说实现时并不需要关心文档中的全部内容，前端开发者一般只需要关心
1.产品前端的逻辑，例如页面之间是如何交互的，数据是如何传递的，权限是如何设计的等等
2.这个需求中增加了哪些接口，后端会给前端哪些接口，前端如何调用接口（传入参数，返回值）
3.原型图是怎么设计的，这直接和前端页面有关系
（或者其他与前端开发有关的提及到的内容）
基于此，我需要设计一个网站，用来简单又高效的完成这个事情
在这个网站中，用户直接复制一个文档作为输入，内容可能如example.md所示（仅做一个举例，这是一个比较简单和普通的情况，文档会因人而异，各种产品经理写出的文档都有可能，要想到各种情况）：

例如对于这样一个文档，我需要经过ai输出后的结果是给前端看的，包含所有前端开发者需要的完整内容而不包括前端不关心的内容，例如后端的数据结构定义，后端的规范等等，都不关心，
对于这样一个文档，最后输出的内容只需要包括
1.文档中提到的所有接口及其参数，返回值，都要清楚列出来
2.需要在页面中加的所有操作，例如在哪个页面需要加一个删除按钮，在哪里需要加编辑。
对于这个文档中的一个例子，例如发布mcp时不仅要说明接口POST /mcp_server/create以及Request Param和Response Body，还要说清楚文档中提到的。
入口在AI应用的详情页（从“我发布的”or “我克隆的”点进来的才有）
“发布MCP Server”的按钮，只会出现在“我发布的”、“我收藏的”列表点出的AI应用的详情页中，按钮出现条件是：
1. BMV类型是AI应用
2. BMV的发布者是当前用户
3. 如果BMV是fork的，则发布者已经变为操作fork的用户了，也适用此条件
4. BMV的mcp_id=0
5. 如果mcp不存在，则为0
6. 如果mcp存在，mcp与AI应用的public必然一致，mcp_id>0，此时不能再发布mcp
1. fork的AI应用，如果有mcp，也会自动fork mcp。
任何前端写业务时和前端有关的逻辑都要保留，如果你充分理解上下文的话，可以对部分逻辑进行解释方便开发人员更易理解。切记，不能曲解文档任何原有意思
输出的内容，按一定的规范，对前端开发者友好最重要，假定前端开发者会把输出的内容之间给ai让ai结合项目代码完成功能，输出的内容会作为prompt给ai coding 因此，输出的内容应该是一个好的完善的易于理解的prompt

开发这个网站时注意：
只需要一个页面完成这个逻辑即可
不需要任何我没有提及的无用功能，例如登录，保存历史内容等等都不需要，因此不需要数据库。如果有必要的内容可以存到localstorage中
项目使用SvelteKit开发
接入ai时使用siliconflow提供的api，
请求调用示例（openai格式）：
const url = 'https://api.siliconflow.cn/v1/chat/completions';
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '{"model":"","messages":[{"role":"user","content":"What opportunities and challenges will the Chinese large model industry face in 2025?"}]}'
};
try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
response示例：
{
  "id": "<string>",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "<string>",
        "reasoning_content": "<string>",
        "tool_calls": [
          {
            "id": "<string>",
            "type": "function",
            "function": {
              "name": "<string>",
              "arguments": "<string>"
            }
          }
        ]
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 123,
    "total_tokens": 123
  },
  "created": 123,
  "model": "<string>",
  "object": "chat.completion"
}
模型使用zai-org/GLM-4.5V
写代码时遵循以下：

单个文件代码不能超过500行
遵循设计模式六大原则：单一职责原则、开闭原则、里氏替换原则、接口隔离原则、依赖倒置原则和迪米特法则
 比如：如果代码里没有统一异常处理，
尽量不要用try catch
通用的工具方法写在统一的工具方法中，当前页面如果内容过多则拆分出组件
简单的if判断使用三元表达式
接口返回值用可选链
可能为空引发报错的数组用｜｜赋默认值
css使用的尽量少，不要有多余的样式，能用一行css实现的不要用两行，能不多加类名的地方就不需要
不要多加额外的层级，不需要的地方不用套额外的div
css使用的尽量少，不要有多余的样式，能用一行css实现的不要用两行，能不多加类名的地方就不需要
函数尽量不要有过大的开销，注重性能，不能有n*n复杂度的函数
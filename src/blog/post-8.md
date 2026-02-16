---
title: "ESP-32 S3开发试验"
pubDate: 2026-02-11
description: ""
author: "Elon Woo"
tags: []
likeCount: 0
shareCount: 0
docked: false
---

## 配置开发环境

在vscode中安装[esp-idf扩展](https://github.com/espressif/vscode-esp-idf-extension/blob/master/README.md)，打开开发文件夹。


vscode中，esp idf已经适配了配置环境的快捷按钮。点击底部的打开ESP-IDF终端按钮即可

### 安装

首先运行`echo $env:IDF_TARGET`，如果不是`esp32s3`，则运行`Remove-Item Env:\IDF_TARGET`。 接下来运行`idf.py set-target esp32s3`，这一步有点慢，会在项目目录里生成sdkconfig文件。

### 部署

运行`cp main/mimi_secrets.h.example main/mimi_secrets.h`使用miniclaw/main目录下的mimi_secrets.h.example复制一份mimi_secrets.h文件。

编辑mimi_secrets.h文件:

```
#define MIMI_SECRET_WIFI_SSID       "YourWiFiName"
#define MIMI_SECRET_WIFI_PASS       "YourWiFiPassword"
#define MIMI_SECRET_TG_TOKEN        "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
#define MIMI_SECRET_API_KEY         "sk-ant-api03-xxxxx"
#define MIMI_SECRET_SEARCH_KEY      ""              // optional: Brave Search API key
#define MIMI_SECRET_PROXY_HOST      ""              // optional: e.g. "10.0.0.1"
#define MIMI_SECRET_PROXY_PORT      ""              // optional: e.g. "7897"
```
vscode的problems报错`Unable to resolve configuration with compilerPath: "/usr/bin/gcc"`

运行`xtensa-esp32s3-elf-gcc --version`，确保已经有ESP32‑S3工具链并且可以用。

运行`Get-Command xtensa-esp32s3-elf-gcc`，找到工具链的目录。

在.vscode目录中创建c_cpp_properties.json文件，将如下内容修改includePath和compilerPath复制进去，稍等一些报错消失。

```
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "${workspaceFolder}/**",
                "C:/Espressif/tools/xtensa-esp-elf/esp-14.2.0_20251107/xtensa-esp32s3-elf/include"
            ],
            "defines": [],
            "compilerPath": "C:/Espressif/tools/xtensa-esp-elf/esp-14.2.0_20251107/xtensa-esp32s3-elf/bin/xtensa-esp32s3-elf-gcc.exe",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "intelliSenseMode": "windows-gcc-x64"
        }
    ],
    "version": 4
}
```

接下来运行`idf.py fullclea`清除build，每次mimi_secrets.h文件改变后都要运行该命令。

然后运行`idf.py build`进行完整编译，稍等一段时间。
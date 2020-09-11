#### 依赖安装
```
  yarn install

```
#### 调试环境
```
  yarn start
```
#### 环境部署
```
  yarn build
```

#### 目录结构

- build 打包文件
- config webpack代理配置
- public 入口html
- src
	- assets 资源目录
		- imgs 图片和icon
		- medias 媒体资源
	- beans 常量定义
	- components 公共组件
  	- error 错误边界处理组件
  	- header 主页面头部组件
  	- loading 数据加载组件
  	- map 地图相关组件
	- pages
		- login 登录页
		- main 主页面
      * index 主页面入口
      * route 主页面路由配置
  	* App 根组件
	- pwa
	- routers 路由
	- services 业务接口api
	- store 状态管理
	- styles 公共样式
	- utils 工具函数
  	* eventBus 全局事件总线
  	- map_layer mapbox地图layer对象
    	- format 地图坐标数据处理工具方法
    	- geo_util 坐标系转换工具方法
    	- special_map 辖区面图
	* index 项目入口文件
* .prettierrc 编辑器代码格式化配置
* .stylintrc 编辑器 ts 提示配置
* types.d.ts ts 中图片格式类型声明
* tsconfig.json ts 配置
* tslint.json ts 验证规则配置
* webpack.config.js webpack 配置
# react-tentacle
react简易状态管理,目前仅适用于函数式组件，支持typescript

## 存在的意义
应用于项目关于局部单向流复杂状态的管理

## 实现的原理
通过发布订阅设计模式，结合hooks的usestate来更新组件，以同步更新状态

## 暴露api

> createTentacle

> * state 全局最新状态
> * destroy 销毁并重置全局状态至初始值
> * dispatch 调度函数
> * useListen 监听状态改变
> * subscribe 订阅状态改变
> * unSubscribe 取消订阅
> * useTentacles 使用hooks读取全局状态

-----

> scheduler

> * subscribe 订阅状态改变
> * unSubscribe 取消订阅
> * dispatch 发布状态
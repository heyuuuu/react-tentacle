# react-tentacle
react分散型状态管理

## 存在的意义
相对于recoil更加灵活，通过deps来深比较来决定组件是否需要更新。

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
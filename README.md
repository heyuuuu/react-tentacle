# react-tentacle
react分散型状态管理

## 存在的意义
相对于recoil更加灵活，通过deps来深比较来决定组件是否需要更新。

## 暴露api

> tentacle

> * state 全局最新状态
> * dispatch 调度函数
> * useTentacle 使用状态
> * useReduceTentacle 还原或初始化状态，置于顶层使用

-----

> observer

> * listen 订阅状态
> * destroy 取消订阅
> * dispatch 发布状态

-----

> immutable 对象突变

> * clear 删除某个属性或所有属性
> * setting 设置属性
> * keepData 对象唯一性
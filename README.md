# react-tentacle
react分散型状态管理

## 存在的意义
相对于recoil更加灵活，通过deps来深比较来决定组件是否需要更新。

## 暴露api

> tentacle
> * state 状态值
> * listen 监听状态值改变
> * mutation 仅改变状态值
> * reactive 改变状态值并触发更新
> * useTentacle 使用状态值
> * useReduceTentacle 还原状态值，置于顶层使用

> tentacle.useTentacle
> * raw 原始状态值
> * state 组件状态值
> * mutation 更新原始状态值
> * reactive 更新原始状态值并同步组件状态值

> observer
> * listen 订阅状态
> * destroy 取消订阅
> * dispatch 发布状态


> immutable 对象突变
> * state 原始值
> * clean 删除某个属性或所有属性
> * mutation 改变原始值

## 内置hooks

> useReactives
> * raw 初始值
> * state 状态值
> * mutation 仅改变初始值
> * reaction 将初始值同步到状态值
> * reactive 改变初始值并同步到状态值
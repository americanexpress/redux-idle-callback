<h1 align="center">
  <img src="./redux-idle-callback.png" alt="redux-idle-callback - One Amex" width="50%" />
</h1>

> Redux middleware that queues an action to be dispatched during the Redux store's idle periods.

[![npm](https://img.shields.io/npm/v/redux-idle-callback)](https://www.npmjs.com/package/redux-idle-callback)
![Health Check](https://github.com/americanexpress/redux-idle-callback/workflows/Health%20Check/badge.svg)

## 👩‍💻 Hiring 👨‍💻

Want to get paid for your contributions to `redux-idle-callback`?
> Send your resume to oneamex.careers@aexp.com

## 📖 Table of Contents

* [Features](#Features)
* [Usage](#Usage)
* [API](#API)
* [Available Scripts](#Available%20Scripts)
* [Git Hooks](#Git%20Hooks)
* [Contributing](#Contributing)

## ✨ Features

* Allows Redux applications to react to a Redux Store's idle periods via a queued Redux action.
* Action to be fired during idleness can be configured.

## Motivation

In a single-page application, accurately reporting a page load when modules are being loaded on to
the page asynchronously can be hard. A timeout could be used to report the page load after an
arbitrary time, but in large applications, that solution is unreliable as each page has their own
requirements.  `redux-idle-callback` will flag when your Redux store has been idle for a certain
amount of time. If an application ties the modules' loading state to a Redux store,
`redux-idle-callback` can flag when the page is done loading, because the store will have an idle
period once all the modules are done loading.

## `redux-idle-callback` vs `requestIdleCallback`

[`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
will wait until the browser is idle to call its callback function. `redux-idle-callback` will wait
until the Redux store is idle to dispatch an action. Both of these are similar in that they wait for
idle periods to run less important work. However, `requestIdleCallback` is
[limited by browser](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#Browser_compatibility)
whereas `redux-idle-callback` can only be used with applications that use Redux.

## 🤹‍ Usage

### Installation

```bash
npm i --save redux-idle-callback
```

```javascript
  import { createStore, applyMiddleware } from 'redux';
  import createIdleMiddleware from 'redux-idle-callback';
  import reducer from './reducer';

  const store = createStore(
    reducer,
    applyMiddleware(createIdleMiddleware())
  );

```

## 🎛️ API

### createIdleMiddleware
`createIdleMiddleware` will setup the conditions for when or how often you want the idle state to be reported.
By default, `createIdleMiddleware` returns middleware that will stop polling for idleness after dispatching its first idle action.

```js
const myActionCreator = () => ({ type: 'STORE_IS_IDLE' });

createIdleMiddleware({ idleTime: 500, intervalTime: 100, alwaysOn: false, idleAction: myActionCreator });
```

#### Parameters

| Param         | Type              | Description                                                                                      |
| ---           | ---               | ---                                                                                              |
| idleTime      | `number`          | The amount of time idle before we dispatch an `IS_IDLE` or actionIdle action. Defaults to 500 ms.|
| intervalTime  | `number`          | How often we poll for idleness. Defaults to polling every 100 ms.                                |
| alwaysOn      | `boolean`         | Option to continually check for idleness without ever stopping.                                  |
| idleAction    | `function/object` | Action creator/action that will be dispatched instead of `IS_IDLE` when idle.                    |

#### Return Value

Returns a middleware that can be used with your redux store with the specific options.

### IS_IDLE
`IS_IDLE` is the action type dispatched by the middleware. You can add this to your reducer.

```javascript
  import { IS_IDLE } from 'redux-idle-callback';

  const reducer = (state, action) => {
    switch(action.type) {
      case IS_IDLE: {
        /* Do something when idle  */
      }
    }
  };
```

### START_IDLE
`START_IDLE` is the action type the middleware listens for in order to restart polling for idleness. You can add this to your reducer.

```javascript
  import { START_IDLE } from 'redux-idle-callback';

  const reducer = (state, action) => {
    switch(action.type) {
      case START_IDLE: {
        /* Do something when polling has restarted  */
      }
    }
  };
```

### startIdle
startIdle creates an action that, when dispatched, will restart polling for idleness. If `alwaysOn` is true, this will not start another instance of `setInterval`.

```javascript
  import { startIdle } from 'redux-idle-callback';

  (dispatch) => {
    dispatch(startIdle);
  };
```

#### Return Value

Returns a action that, when dispatched, will restart polling for idleness.

**Tips**
`alwaysOn` is not recommended, as having a `setInterval` poll continuously can impact performance.

## 📜 Available Scripts

**`npm run lint`**

Verifies that your code matches the American Express code style defined in
[`eslint-config-amex`](https://github.com/americanexpress/eslint-config-amex).

**`npm run build`**

Runs `babel` to compile `src` files to transpiled JavaScript into `lib` using
[`babel-preset-amex`](https://github.com/americanexpress/babel-preset-amex).

**`npm test`**

Runs unit tests **and** verifies the format of all commit messages on the current branch.

**`npm posttest`**

Runs linting on the current branch.

## 🎣 Git Hooks

These commands will be automatically run during normal git operations like committing code.

**`pre-commit`**

This hook runs `npm test` before allowing a commit to be checked in.

**`commit-msg`**

This hook verifies that your commit message matches the One Amex conventions. See the **commit
message** section in the [contribution guidelines](./CONTRIBUTING.md).

## 🏆 Contributing

See [contributing guidelines](./CONTRIBUTING.md)

## 🗝️ License

Any contributions made under this project will be governed by the [Apache License 2.0](./LICENSE.txt).

## 🗣️ Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md).
By participating, you are expected to honor these guidelines.

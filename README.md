# `redux-idle-callback`

Redux middleware that queues an action to be dispatched during the Redux store's idle periods.

> Want to get paid for your contributions to `redux-idle-callback`?
> Send your resume to oneamex.careers@aexp.com

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

## Installation

```bash
npm i --save redux-idle-callback
```

## Usage:

```javascript
  import { createStore, applyMiddleware } from 'redux';
  import createIdleMiddleware from 'redux-idle-callback';
  import reducer from './reducer';

  const store = createStore(
    reducer,
    applyMiddleware(createIdleMiddleware())
  );

```

## createIdleMiddleware
`createIdleMiddleware` will setup the conditions for when or how often you want the idle state to be reported.
By default, `createIdleMiddleware` returns middleware that will stop polling for idleness after dispatching its first idle action.

```
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

## IS_IDLE
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

## START_IDLE
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

## startIdle
startIdle creates an action that, when dispatched, will restart polling for idleness. If `alwaysOn` is true, this will not start another  instance of `setInterval`.

```javascript
  import { startIdle } from 'redux-idle-callback';

  (dispatch) => {
    dispatch(startIdle);
  };
```

#### Return Value

Returns a action that, when dispatched, will restart polling for idleness.

## Tips
`alwaysOn` is not recommended, as having a `setInterval` poll continuously can impact performance.

## Contributing
We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/redux-idle-callback).

Please feel free to open pull requests and see [CONTRIBUTING.md](./CONTRIBUTING.md) for commit formatting details.

## License
Any contributions made under this project will be governed by the [Apache License
2.0](./LICENSE.txt).

## Code of Conduct
This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md).
By participating, you are expected to honor these guidelines.

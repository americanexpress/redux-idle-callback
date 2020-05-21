/*
 * Copyright 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

export const IS_IDLE = '@@redux-idle-callback/IS_IDLE';
export const START_IDLE = '@@redux-idle-callback/START_IDLE';

export const startIdle = {
  type: START_IDLE,
};

const createIdleMiddleware = ({
  idleTime = 500,
  intervalTime = 100,
  alwaysOn,
  idleAction,
} = {}) => ({ dispatch }) => {
  let timeOfLastAction = Date.now();
  let interval = null;

  const actionToDispatch = () => {
    if (typeof idleAction === 'function') {
      return idleAction();
    }
    if (typeof idleAction === 'object') {
      return idleAction;
    }
    return { type: IS_IDLE };
  };

  const idleInterval = () => {
    if (global.window && interval === null) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - timeOfLastAction >= idleTime) {
          dispatch(actionToDispatch());
          if (!alwaysOn) {
            clearInterval(interval);
            interval = null;
          }
        }
      }, intervalTime);
    }
  };

  idleInterval();

  return next => (action) => {
    timeOfLastAction = Date.now();
    if ((action.type === START_IDLE && !alwaysOn)) {
      idleInterval();
    }
    return next(action);
  };
};

export default createIdleMiddleware;

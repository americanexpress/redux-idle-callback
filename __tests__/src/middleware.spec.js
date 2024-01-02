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

import createIdleMiddleware, { IS_IDLE, START_IDLE, startIdle } from '../../src/middleware';

describe('middleware', () => {
  const next = jest.fn();
  const dispatch = jest.fn();
  const setDate = (a) => {
    Date.now = jest.fn(() => a);
  };

  jest.useFakeTimers({ legacyFakeTimers: true });

  beforeEach(() => {
    jest.clearAllMocks();
    setDate(0);
  });

  const setupMiddleware = (setup) => createIdleMiddleware(setup)({ dispatch });

  describe('startIdle', () => {
    it('should return action witht type: START_IDLE', () => {
      expect(startIdle).toEqual({ type: START_IDLE });
    });
  });

  describe('default middleware setup', () => {
    it('should return middleware and dispatch when idle', () => {
      setupMiddleware({});
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval.mock.calls[0][1]).toEqual(100);
      expect(dispatch).not.toHaveBeenCalled();
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
      expect(clearInterval).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledTimes(1);
    });
  });

  describe('setup options', () => {
    beforeEach(() => {
      jest.clearAllTimers();
    });

    it('should set the interval time', () => {
      const intervalTime = 300;
      setupMiddleware({ intervalTime });
      expect(setInterval.mock.calls[0][1]).toEqual(intervalTime);
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).not.toHaveBeenCalled();
      jest.advanceTimersByTime(200);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
    });

    it('should set the idle time', () => {
      const idleTime = 300;
      setupMiddleware({ idleTime });
      setDate(100);
      jest.advanceTimersByTime(100);
      expect(dispatch).not.toHaveBeenCalled();
      setDate(idleTime);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
    });

    it('should not clear the interval when alwaysOn is set', () => {
      setupMiddleware({ alwaysOn: true });
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
    });

    it('should reset the interval when the START_IDLE is found', () => {
      const nextAction = setupMiddleware();
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      nextAction(next)({ type: START_IDLE });
      setDate(1000);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('should not remove interval if alwaysOn', () => {
      const nextAction = setupMiddleware({ alwaysOn: true });
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
      nextAction(next)({ type: START_IDLE });
      setDate(1000);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('should not set more than one setInterval', () => {
      const nextAction = setupMiddleware();
      nextAction(next)({ type: START_IDLE });
      nextAction(next)({ type: START_IDLE });
      expect(setInterval).toHaveBeenCalledTimes(1);
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
    });

    it('should dispatch action in idleAction', () => {
      const idleAction = { type: 'testAction' };
      setupMiddleware({ idleAction });
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'testAction' });
    });

    it('should dispatch action creator in idleAction', () => {
      const idleAction = () => ({ type: 'testActionCreator' });
      setupMiddleware({ idleAction });
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'testActionCreator' });
    });

    it('should dispatch IS_IDLE, if idleAction is not an action creator or action', () => {
      const idleAction = 'string';
      setupMiddleware({ idleAction });
      setDate(500);
      jest.advanceTimersByTime(100);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: IS_IDLE });
    });
  });
});

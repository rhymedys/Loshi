/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-25 14:31:48
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-25 16:09:46
 */

import wepy from 'wepy'
import {jSessionIDKey, requestPrefixUrl} from '../config/app'

/**
 *检查Session是否过期
 *
 * @export
 * @returns {Boolean} 是否过期
 */
async function checkSessionIsOverdue() {
  const checkSessionRes = await wepy.checkSession()
  const res = checkSessionRes.errMsg !== 'checkSession:ok' || !getSessionInfo()
  res && clearSessionInfo()
  return res
}

/**
 * 登录
 *
 * @returns {Promise} 登录promise
 */
function login() {
  return wepy.login()
}

/**
 * 检查Session是否过期且重新登录
 *
 * @returns {String} session信息
 */
async function checkSessionIsOverdueAndLoginAgain() {
  if (await checkSessionIsOverdue()) {
    const loginRes = await login()
    if (loginRes.code) {
      const getSessionRes = await wepy.request({
        url: `${requestPrefixUrl}login`,
        data: {
          code: loginRes.code
        }
      })

      if (getSessionRes.data.resultCode === 0) {
        setSessionInfo(getSessionRes.data.data.JSESSIONID)
      }
    }
  }

  return getSessionInfo()
}

/**
 * 存储jSessionID值
 *
 * @export
 * @param {String} jSessionID session值
 */
function setSessionInfo(jSessionID) {
  if (jSessionID) wepy.setStorageSync(jSessionIDKey, jSessionID)
}

/**
 * 获取session信息
 *
 * @export
 * @returns {String} session信息
 */
function getSessionInfo() {
  return wepy.getStorageSync(jSessionIDKey)
}

/**
 *清空session信息
 *
 * @export
 */
function clearSessionInfo() {
  wepy.removeStorageSync(jSessionIDKey)
}

export {
  checkSessionIsOverdue,
  setSessionInfo,
  getSessionInfo,
  clearSessionInfo,
  checkSessionIsOverdueAndLoginAgain,
  login
}

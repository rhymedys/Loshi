/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-25 14:31:48
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-26 13:45:22
 */

import wepy from 'wepy'
import {jSessionIDKey, requestPrefixUrl, jSessionIDExpiresKey} from '../config/app'

/**
 *检查Session是否过期
 *
 * @export
 * @returns {Boolean} 是否过期
 */
async function checkSessionIsOverdue() {
  const checkSessionRes = await wepy.checkSession()
  const res = checkSessionRes.errMsg !== 'checkSession:ok' || !getSessionInfo()[jSessionIDKey] || new Date().getTime() >= getSessionInfo()[jSessionIDExpiresKey] - 60 * 1000
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
        const {data} = getSessionRes.data
        setSessionInfo(data.JSESSIONID, data.expires)
      }
    }
  }

  return getSessionInfo()[jSessionIDKey]
}

/**
 * 存储jSessionID值
 *
 * @export
 * @param {String} jSessionID session值
 * @param {String} expires session 过期时间时间
 */
function setSessionInfo(jSessionID, expires) {
  if (jSessionID && expires) {
    wepy.setStorageSync(jSessionIDKey, jSessionID)
    wepy.setStorageSync(jSessionIDExpiresKey, expires)
  }
}

/**
 * 获取session信息
 *
 * @export
 * @returns {String} session信息
 */
function getSessionInfo() {
  return {
    [jSessionIDKey]: wepy.getStorageSync(jSessionIDKey),
    [jSessionIDExpiresKey]: wepy.getStorageSync(jSessionIDExpiresKey) || 0
  }
}

/**
 *清空session信息
 *
 * @export
 */
function clearSessionInfo() {
  wepy.removeStorageSync(jSessionIDKey)
  wepy.removeStorageSync(jSessionIDExpiresKey)
}

export {
  checkSessionIsOverdue,
  setSessionInfo,
  getSessionInfo,
  clearSessionInfo,
  checkSessionIsOverdueAndLoginAgain,
  login
}

/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-24 14:21:09
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-25 16:07:48
 */
import wepy from 'wepy'
import {isDebug, requestPrefixUrl} from '../config/app'
import {checkSessionIsOverdueAndLoginAgain} from './session'

async function request (options) {
  let res
  if (!options) {
    res = Promise.reject(new Error('request配置错误 options为空'))
  } else {
    const sessionId = await checkSessionIsOverdueAndLoginAgain()
    res = wepy.request(Object.assign({}, options, {
      url: isDebug ? `${requestPrefixUrl}${options.url}` : '',
      data: Object.assign({sessionId}, options.data)
    }))
  }
  return res
}

export {
   request
 }

/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-24 14:21:09
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-24 14:35:07
 */
import wepy from 'wepy'
import {isDebug} from '../config/app'

function request (options) {
  let res
  if (!options) {
    res = Promise.reject(new Error('request配置错误 options为空'))
  } else {
    res = wepy.request(Object.assign({}, options, {
      url: isDebug ? `http://localhost:7001/loshi/${options.url}` : ''
    }))
  }
  return res
}

export {
   request
 }

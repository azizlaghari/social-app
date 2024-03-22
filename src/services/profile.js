/* eslint-disable no-empty */
import { attachToken, privateAPI } from '../config/constants'
import { notification } from 'antd'
import store from '../redux/store'
import { LOGIN } from '../redux/types/authTypes'

export const getProfile = async () => {
  try {
    attachToken()
    const res = await privateAPI.get('/me')
    // console.log({ res })
    if (res) {
      await store.dispatch({
        type: LOGIN,
        payload: { user: res?.data },
      })
      console.log(res?.data)
      return res?.data
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
    })
  }
}

export const updateProfile = async (payload) => {
  try {
    attachToken()
    const res = await privateAPI.put('/me', payload)
    console.log({ res })
    if (res) {
      getProfile()

      return res?.data
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
    })
  }
}
export const uploadProfile = async (file) => {
  try {
    attachToken()
    const formData = new FormData()
    formData.append('file', file)
    const res = await privateAPI.post('/me/upload', formData)
    // console.log({ res })
    if (res) {
      getProfile()
      return res?.data
    }
  } catch (err) {
    notification.error({
      message: err?.response?.data?.message || 'Server Error',
      duration: 3,
    })
  }
}

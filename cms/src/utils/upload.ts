import { message } from 'antd'

export function beforeUpload(file) {
  console.log('======= BEFORE UPLOAD ======')
  const isLt2M = file.size / 1024 / 1024 < 2
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg'
  if (!isJpgOrPng) {
    message.error('You can only upload jpg, jpeg and png file type')
  }
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isLt2M && isJpgOrPng
}

export function dummyRequest({ file, onSuccess }) {
  setTimeout(() => {
    onSuccess('ok')
  }, 0)
}

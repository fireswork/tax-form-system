/**
 * 将电话号码格式化为美国格式: (xxx) xxx-xxxx
 * 支持实时格式化，根据输入长度动态调整格式
 */
export function formatPhoneNumber(value: string): string {
  // 移除所有非数字字符
  const phoneNumber = value.replace(/\D/g, '')
  
  // 根据输入长度动态格式化
  if (phoneNumber.length === 0) {
    return ''
  } else if (phoneNumber.length <= 3) {
    return `(${phoneNumber})`
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }
}

/**
 * 将格式化的电话号码转换回纯数字
 */
export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, '')
} 
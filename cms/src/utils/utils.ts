import { match } from 'react-router-dom'
import { parse } from 'querystring'
import dayjs from 'dayjs'
import { Tag } from 'antd';
import useStore from 'store'
import moment from 'moment'
import { RangePickerProps } from 'antd/es/date-picker/generatePicker'

export const getPageQuery = () => parse(window.location.href.split('?')[1])
type RangePickerValue = RangePickerProps<moment.Moment>['value']

export const getStateFromStore = (key: string) => {
  const initRememberMe = useStore.get('rememberMe')
  if (initRememberMe) {
    const storages = [require('store/storages/localStorage')]
    const store = useStore.createStore(storages)
    if (!key) return null
    const data = store.get(key)
    if (!data || typeof data !== 'string') return data
    try {
      const _parsedData = JSON.parse(data)
      return _parsedData
    } catch (error) {
      return data
    }
  } else {
    const storages = [require('store/storages/sessionStorage')]
    const store = useStore.createStore(storages)
    if (!key) return null
    const data = store.get(key)
    if (!data || typeof data !== 'string') return data
    try {
      const _parsedData = JSON.parse(data)
      return _parsedData
    } catch (error) {
      return data
    }
  }
}

export const formatDate = (cdate: any) => {
  try {
    let fdate = 'date is empty'
    if (cdate) {
      fdate = dayjs(cdate).format('DD-MM-YY')
      return fdate
    } else {
      return fdate
    }
  } catch (error) {
    return alert(`Error format date: ${error}`)
  }
}

export const isDataURL = (str: any) => {
  try {
    if (str.match(isDataURL.regex)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('errors check image product data url', error)
    return false
  }
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i

export const formatMessageResponse = (str: string) => {
  if (!str) return null
  try {
    return (
      str.charAt(0) +
      str
        .slice(1)
        .replaceAll('_', ' ')
        .toLowerCase()
    )
  } catch (error) {
    console.log('errors in format message function in utils', error)
    return null
  }
}

export const getResidences = () => {
  const values = [
    {
      value: 'VN',
      label: 'VN',
      children: [
        {
          value: 'Hồ Chí Minh',
          label: 'Hồ Chí Minh',
        },
      ],
    },
    {
      value: 'US',
      label: 'US',
      children: [
        {
          value: 'Washinton',
          label: 'Washinton',
        },
      ],
    },
  ]
  return values
}

export const fixedZero = (val: number) => {
  return val * 1 < 10 ? `0${val}` : val
}

export const getTimeDistance = (
  type: 'today' | 'week' | 'month' | 'year',
): RangePickerValue => {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - day * oneDay

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))]
  }
  const year = now.getFullYear()

  if (type === 'month') {
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`,
        ).valueOf() - 1000,
      ),
    ]
  }

  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
}

export const convertDateToInt = value => {
  return new Date(value).getTime()
}

 
 export const getUniqueValues = (data, type) => {
   let unique = data?.map((item) => item[type])
   if (type === 'colors') {
     unique = unique.flat()
   }
 
   return [...new Set(unique)]
 }
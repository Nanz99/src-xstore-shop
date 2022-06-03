import moment from 'moment'
import {
  DashboardModelState,
  RadarDataItem,
  VisitDataItem,
} from '@/models/dashboard.model'



// mock data
const visitData: VisitDataItem[] = []
const beginDay = new Date().getTime()

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      'YYYY-MM-DD',
    ),
    y: fakeY[i],
  })
}

const visitData2 = []
const fakeY2 = [1, 6, 4, 8, 3, 7, 2]
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      'YYYY-MM-DD',
    ),
    y: fakeY2[i],
  })
}

const salesData = []
for (let i = 0; i < 7; i += 1) {
  salesData.push({
    x: `${i + 1}M`,
    y: Math.floor(Math.random() * 1000) + 200,
  })
}
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `vndigitech-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  })
}
const salesTypeData = [
  {
    x:  'Mới',
    y: 0,
  },
  {
    x: 'Đang xử lý',
    y: 6,
  },
  {
    x: 'Đang giao',
    y: 1,
  },
  {
    x: 'Hoàn thành',
    y: 3,
  },
  {
    x: 'Từ chối',
    y: 3,
  },
]

const salesTypeDataOnline = [
  {
    x: 'Jimu',
    y: 244,
  },
  {
    x: 'Humanoid',
    y: 321,
  },
  {
    x: 'uKit',
    y: 311,
  },
  {
    x: 'Primary School',
    y: 41,
  },
  {
    x: 'PAI Tech',
    y: 121,
  },
  {
    x: 'Other',
    y: 111,
  },
]

const salesTypeDataOffline = [
  {
    x: 'Jimu',
    y: 99,
  },
  {
    x: 'Humanoid',
    y: 188,
  },
  {
    x: 'uKit',
    y: 344,
  },
  {
    x: 'Primary School',
    y: 255,
  },
  {
    x: 'Other',
    y: 65,
  },
]

const radarOriginData = [
  {
    name: 'Personal',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: 'Team',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: 'Department',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
]

const radarData: RadarDataItem[] = []
const radarTitleMap = {
  ref: 'Quote',
  koubei: 'Koubei',
  output: 'Output',
  contribute: 'Contribution',
  hot: 'Hot',
}
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      })
    }
  })
})

const getFakeChartData: DashboardModelState = {
  visitData,
  visitData2,
  salesData,
  searchData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
}

export default {
  'GET  /api/fake_chart_data': getFakeChartData,
}

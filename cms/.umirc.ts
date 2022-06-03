import { defineConfig } from 'umi'
import { routes } from './config/routes'
import defaultSettings from './config/defaultSetting'

export default defineConfig({
  title: 'CMS | Digitech Solutions',
  // hash: true,
  history: { type: 'hash' },
  locale: {
    antd: true,
    default: 'vi-VN',
    baseNavigator: true,
    baseSeparator: '-',
    title: false,
  },
  dva: {
    // hmr: true,
    // skipModelValidate:true
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  analytics: {
    ga: 'UX_ANSNSN',
  },
  antd: {},
  ignoreMomentLocale: true,
  targets: {
    ie: 9,
  },
  pwa: false,
  theme: {
    '@primary-color': defaultSettings.primaryColor,
    '@font-size-base': '14px',
    '@link-color': defaultSettings.primaryColor,
    // '@layout-sider-background': '#121212',
    // 'layout-body-background': '#f0f2f5',
  },
  routes,
  define: {
    'process.env.API_URL': process.env.API_URL || false,
    ENV_ODOO_WEBSITE: process.env.ODOO_WEBSITE || false,
  },
  favicon: '/short_logo_ccentre.ico',
})

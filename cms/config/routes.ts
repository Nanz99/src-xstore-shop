import { IRoute } from 'umi'
import { Component } from 'react'

export const routes: IRoute[] = [
         {
           path: '/login',
           exact: false,
           wrappers: ['@/layouts/UserLayout'],
           component: '@/pages/users/login',

         },
         {
           path: '/logout',
           exact: true,
           component: '@/pages/users/logout',
         },
         {
           path: '/forgot',
           exact: false,
           wrappers: ['@/layouts/UserLayout'],
           component: '@/pages/users/forgot',
         },
         {
           path: '/reset',
           exact: false,
           wrappers: ['@/layouts/UserLayout'],
           component: '@/pages/users/reset',
         },
         {
           path: '/',
           component: '@/layouts/BasicLayout',
           wrappers: ['@/layouts/SecurityLayout'],
           exact: true,
           routes: [
             {
               path: '/',
               redirect: '/dashboard',
             },
             {
               path: '/dashboard',
               name: 'dashboard',
               exact: true,
               icon: 'DashboardOutlined',
               component: '@/pages/dashboard/dashboard.page',
             },
             //USER
             // {
             //   path: '/user',
             //   exact: false,
             //   name: 'User',
             //   icon: 'AuditOutlined',
             //   routes: [
             //     {
             //       exact: false,
             //       path: 'user/customers',
             //       name: 'Customer',
             //       component: '@/pages/users/customers/customers.page',
             //       routes:[
             //         {
             //           exact: false,
             //           path: 'user/customers',
             //           component: '@/pages/users/customers/customers.page',
             //         }
             //       ]
             //     },
             //     {
             //       exact: false,
             //       path: 'user/customers/:id',
             //       component: '@/pages/users/customers/[id].page',
             //     },
             //   ],
             // },

             //products
             {
               path: '/product',
               exact: false,
               name: 'Product',
               icon: 'BookOutlined',
               routes: [
                 {
                   exact: true,
                   path: '/product',
                   component: '@/pages/products/product.page',
                 },
                 {
                   exact: true,
                   path: '/product/:id',
                   component: '@/pages/products/[id].page',
                 },
               ],

               // routes: [
               //   {
               //     exact: false,
               //     path: '/product/products',
               //     name: 'AllProduct',
               //     routes: [
               //       {
               //         exact: true,
               //         path: '/product/products',
               //         component: '@/pages/products/product.page',
               //       },
               //       {
               //         exact: true,
               //         path: '/product/products/:id',
               //         component: '@/pages/products/[id].page',
               //       },
               //     ],
               //   },
               //   {
               //     exact: false,
               //     path: '/product/stock',
               //     name: 'Stock',
               //     routes: [
               //       {
               //         exact: true,
               //         path: '/product/stock',
               //         component: '@/pages/products/stock/stock.page',
               //       },
               //       {
               //         exact: true,
               //         path: '/product/stock/:id',
               //         component: '@/pages/products/stock/[id].page',
               //       },
               //     ],
               //   },
               // ],
             },

             //Catalog
             //  {
             //    exact: true,
             //    path: '/categories',
             //    name: 'Categories',
             //    icon: 'TagsOutlined',
             //    component: '@/pages/categories/categories.page',
             //  },

             //  Service
             //  {
             //    exact: false,
             //    path: '/properties',
             //    name: 'Properties',
             //    icon: 'ControlOutlined',
             //    routes: [
             //      {
             //        exact: true,
             //        path: '/stock',
             //        component: '@/pages/stock/stock.page',
             //      },
             //      {
             //        exact: true,
             //        path: '/stock/:id',
             //        component: '@/pages/stock/[id].page',
             //      },
             //    ],
             //    routes: [
             //       {
             //         exact: false,
             //         path: '/service/categories',
             //         name: 'Categories',
             //         routes: [
             //           {
             //             exact: true,
             //             path: '/service/categories',
             //             component: '@/pages/service/service.categories.page',
             //           },
             //      //      //  {
             //      //      //    exact: true,
             //      //      //    path: '/stock/stockin/:id',
             //      //      //    component: '@/pages/stock/stockin/[id].page',
             //      //      //  },
             //         ],
             //       },
             //      {
             //        exact: false,
             //        path: '/properties/size',
             //        name: 'Size',
             //        routes: [
             //          {
             //            exact: true,
             //            path: '/properties/size',
             //            component: '@/pages/properties/size/size.list.page',
             //          },
             //          {
             //            exact: true,
             //            path: '/properties/color',
             //            component: '@/pages/service/[id].page',
             //          },
             //        ],
             //      },
             //      {
             //        exact: false,
             //        path: '/properties/color',
             //        name: 'Color',
             //        routes: [
             //          {
             //            exact: true,
             //            path: '/properties/color',
             //            component:
             //              '@/pages/properties/color/color.list.page',
             //          },
             //          {
             //            exact: true,
             //            path: '/service/booking-party/:id',
             //            component: '@/pages/service/BookingParty/[id].page',
             //          },
             //        ],
             //      },
             //    ],
             //  },
             // Contact
             //  {
             //    path: '/contact',
             //    exact: false,
             //    name: 'Contact',
             //    icon: 'ContactsOutlined',
             //    routes: [
             //      {
             //        exact: true,
             //        path: '/contact',
             //        component: '@/pages/contact/contact.page',
             //      },
             //       {
             //         exact: true,
             //         path: '/product/:id',
             //         component: '@/pages/products/[id].page',
             //       },
             //    ],
             //  },
             //Order
             //  {
             //    exact: false,
             //    path: '/orders',
             //    name: 'Order',
             //    icon: 'FormOutlined',
             //    routes: [
             //      {
             //        exact: true,
             //        path: '/orders',
             //        component: '@/pages/orders/order.page',
             //      },
             //      {
             //        exact: true,
             //        path: '/orders/:id',
             //        component: '@/pages/orders/[id].page',
             //      },
             //    ],
             //  },

             //Stock
             //  {
             //    exact: false,
             //    path: '/stock',
             //    name: 'Stock',
             //    icon: 'InboxOutlined',
             // routes: [
             //   {
             //     exact: true,
             //     path: '/stock',
             //     component: '@/pages/stock/stock.page',
             //   },
             //   {
             //     exact: true,
             //     path: '/stock/:id',
             //     component: '@/pages/stock/[id].page',
             //   },
             // ],
             //    routes: [
             //      {
             //        exact: false,
             //        path: '/stock/stockin',
             //        name: 'Stockin',
             //        routes: [
             //          {
             //            exact: true,
             //            path: '/stock/stockin',
             //            component: '@/pages/stock/stockin/stock.page',
             //          },
             //          {
             //            exact: true,
             //            path: '/stock/stockin/:id',
             //            component: '@/pages/stock/stockin/[id].page',
             //          },
             //        ],
             //      },
             //      {
             //        exact: false,
             //        path: '/stock/stockout',
             //        name: 'Stockout',
             //        routes: [
             //          {
             //            exact: true,
             //            path: '/stock/stockout',
             //            component: '@/pages/stock/stockout/stock.page',
             //          },
             //          {
             //            exact: true,
             //            path: '/stock/stockout/:id',
             //            component: '@/pages/stock/stockout/[id].page',
             //          },
             //        ],
             //      },
             //    ],
             //  },

             //Account
             //  {
             //    exact: false,
             //    path: '/account',
             //    name: 'Account',
             //    icon: 'user',
             //    // access: 'canReadAccount',
             //    routes: [
             //      {
             //        exact: true,
             //        path: '/account',
             //        component: '@/pages/account/account.page',
             //      },
             //      {
             //        exact: true,
             //        path: '/account/profile',
             //        component: '@/pages/account/profile.page',
             //      },
             //      {
             //        exact: true,
             //        path: '/account/profile/:id',
             //        component: '@/pages/account/[id].page',
             //      },
             //    ],
             //  },

             //Setting
             //  {
             //    exact: true,
             //    path: '/setting',
             //    name: 'setting',
             //    icon: 'SettingOutlined',
             //    // access: 'READ_CLIENT_SETTING',
             //    component: '@/pages/settings/settings.page',
             //  },
           ],
         },
       ]

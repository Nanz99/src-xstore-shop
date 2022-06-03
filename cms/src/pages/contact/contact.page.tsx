import {
   Card,
   Button,
   Table,
   Row,
   Col,
   Input,
   Radio,
   DatePicker,
   Tag,
   Modal,
   Form,
   message,
   Switch,
   Select,
   notification,
   Tooltip,
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import dayjs from 'dayjs'
import {
   history,
   Dispatch,
   useIntl,
   connect,
   useLocation,
   formatMessage,
   UserItem,
   CategoryItem,

} from 'umi'
import './contact.less'
import React, { useState, useEffect, useMemo } from 'react'
import { ConnectState } from '@/models/connect'
import { ContactItem } from '@/models/contact.model'

import numeral from 'numeral'
import styles from './products.css'
import { ColumnProps } from 'antd/lib/table'
import { isArray, values } from 'lodash'
import Avatar from 'antd/lib/avatar/avatar'
import {

   DeleteOutlined,
   CheckCircleOutlined,
   ExclamationCircleOutlined
} from '@ant-design/icons'

import { deleteContact } from '@/services/contact.service'


const { Meta } = Card
const { Option } = Select

class Params {
   page: number = 1
   limit: number = 10
   name?: string
   verified?: boolean
   status?: number
   sortByPrice?: string
   sortByDate?: string
   condition?: string
}


const ContactPage: React.FC<any> = props => {
   const {
      dispatch,
      loading,
      listContact,
      totalContact
   } = props
   const [params, setParams] = useState(new Params())
   const [destroyForm, setDestroyForm] = useState(false)
   const { formatMessage } = useIntl()
   const { pathname } = useLocation()


   const fetch = async () => {
      dispatch({ type: 'contact/getAllContactModel', payload: params })
   }

   useMemo(() => {
      fetch()
   }, [params, pathname])






   const handleCancel = () => {
      //  setDestroyForm(true)
      //  setVisibleAddForm(false)
      fetch()
   }



   const showTotal = (totalContact: number) => {
      return `${formatMessage({ id: 'product.totalItem' })} ${totalContact}`
   }

   const onTableChange = (page: number) => {
      const newParams = { ...params }
      if (params.page !== page) {
         newParams.page = page
      }
      setParams(newParams)
   }

   const onShowSizeChange = (current: number, size: number) => {
      if (params.limit !== size) {
         params.limit = size
      }
   }

   //Handle Search
   let onChangeProductName = name => {
      setParams({
         ...params,
         name: name,
      })
   }



   //Date Sort
   let handleChangeSortDate = sort => {
      setParams({
         ...params,
         sortByDate: sort,
      })
   }




   const handleConfirmDelete = id => () => {
      Modal.confirm({
         title: formatMessage({ id: 'contact.questDelete' }),
         icon: <ExclamationCircleOutlined />,
         onCancel: handleCancel,
         onOk: handleDelete(id),
         okText: formatMessage({ id: 'product.delete' }),
      });
   };

   const handleDelete = id => async () => {
      const { success } = await deleteContact(id);
      if (success) {
         notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'contact.deleteProductSuccess' }),
         });
         history.go(`/contact`);
      } else {
         notification.success({
            icon: <CheckCircleOutlined style={{ color: 'red' }} />,
            message: formatMessage({ id: 'contact.deleteProductFailed' }),
         });
      }
   };


   const columns: ColumnProps<any>[] = [
      //Index column
      {
         title: formatMessage({ id: 'product.index' }),
         align: 'center',
         render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
      },
      //   {
      //   title: 'ID',
      //   key: 'ID',
      //   align: 'center',
      //   render: values => {
      //     return (
      //       //div Cha
      //       <div

      //       >
      //         <a onClick={() => history.push(`/service/booking-party/${values.id}`)}>
      //         #{values.id || ''}
      //         </a>{' '}

      //       </div>
      //     )
      //   },
      // },
      //Name column
      {
         title: formatMessage({ id: 'contact.fullName' }),
         key: 'name',
         align: 'center',
         render: values => {
            return (
               //div Cha
               <div
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'center',
                     alignContent: 'center',
                  }}
               >
                  {/* <a onClick={() => history.push(`/service/order-service/${values.id}`)}> */}
                  {values.name || ''}
                  {/* </a>{' '} */}

               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'contact.phone' }),
         align: 'center',
         key: 'phone',
         render: values => {
            return (
               <div>
                  {values?.phone}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'contact.email' }),
         align: 'center',
         key: 'email',
         render: values => {
            return (
               <div>
                  {values?.email}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'contact.title' }),
         align: 'center',
         key: 'title',
         render: values => {
            return (
               <div className="textOverflow">
                  {values?.title}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'contact.content' }),
         align: 'center',
         key: 'content',
         render: values => {
            return (
               <Tooltip title={values?.content}>
                  <span className='textOverflow'>{values?.content}</span>
               </Tooltip>
            )
         },
      },
      {
         title: formatMessage({ id: 'contact.date' }),
         align: 'center',
         key: 'date',
         render: values => {
            return (
               <div>
                  {dayjs(values?.createdAt).format(
                     'DD/MM/YYYY',
                  )}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'service.function' }),
         align: 'center',
         key: 'function',
         render: values => {
            return (
               <div>
                  <Button
                     onClick={handleConfirmDelete(values.id)}
                     type="primary"
                     icon={<DeleteOutlined />}
                     shape="circle"
                     danger
                  >

                  </Button>
               </div>

            )
         },
      },

   ]

   return (
      <PageHeaderWrapper>
         <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
            <Row>
               <Col span={8}>
                  {/* Filter public */}


               </Col>
               <Col
                  span={16}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
               >


                  {/* Sort date */}
                  {/* <Select
                     placeholder={formatMessage({ id: 'product.sortDate' })}
                     style={{ width: 120, marginLeft: '8px' }}
                     onChange={handleChangeSortDate}
                     allowClear
                  >
                     <Option value="ALL">
                        {formatMessage({ id: 'product.sortAll' })}
                     </Option>
                     <Option value="ASC">
                        {formatMessage({ id: 'product.sortAsc' })}
                     </Option>
                     <Option value="DESC">
                        {formatMessage({ id: 'product.sortDesc' })}
                     </Option>
                  </Select> */}

                  {/* Search product name */}
                  <Input.Search
                     style={{ width: 300, marginLeft: '16px' }}
                     onChange={e => onChangeProductName(e.target.value)}
                     placeholder={formatMessage({ id: 'service.nameSearch' })}
                     name="name"
                     allowClear
                  />
               </Col>
            </Row>
         </Card>
         <Card>

            <Table
               columns={columns}
               dataSource={listContact}
               rowKey="id"
               loading={loading}
               scroll={{ x: 768 }}
               bordered
               pagination={{
                  showSizeChanger: true,
                  // current: params.page,
                  pageSize: params.limit,
                  total: totalContact,
                  showTotal: showTotal,
                  onChange: onTableChange,
                  onShowSizeChange: onShowSizeChange,
               }}
            />
         </Card>
      </PageHeaderWrapper>
   )
}

export default connect(
   ({ loading, contact }: ConnectState) => ({
      loading: loading.effects['contact/getAllContactModel'],
      listContact: contact?.listContact || [],
      totalContact: contact.total
   }),
)(ContactPage)



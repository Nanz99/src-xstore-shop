import React, { useMemo, useState } from 'react'
import { connect, getLocale, history, useIntl, useLocation } from 'umi'
import { ConnectState } from '@/models/connect';
import { Button, Card, Table, Tag } from 'antd';
import { ProductItem } from '@/models/product.model';
import { ColumnProps } from 'antd/lib/table';
import Avatar from 'antd/lib/avatar/avatar';
import {  EyeOutlined, FileImageOutlined } from '@ant-design/icons';
import './styles.less';

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

function ProductNewPage({ dispatch, listProducts, loading }) {
  const [params, setParams] = useState(new Params());
  const { pathname } = useLocation()
 const { formatMessage } = useIntl()
   const locale = getLocale()
  const fetch = async () => {
    dispatch({ type: 'products/getAllProductsModel', payload: params })
  }

  useMemo(() => {
    fetch()
  }, [params, pathname])
  const columns: ColumnProps<ProductItem>[] = [
    //Index column
    {
      title: '',
      key: 'ID',
      align: 'center',
      render: (v, t, i) => (<div style={{height: '20px', width:'20px',lineHeight: '20px',borderRadius:'50%', backgroundColor:'#7d8597', color:'white', textAlign:'center', fontSize: '12px', fontWeight: 500}}>
         {(params.page - 1) * params.limit + i + 1}
      </div>),
    },
    {
      title: formatMessage({ id: 'dashboard.image' }),
      align: 'center',
      key: 'status',
      render: values => {
        return (
          <div >
            <Avatar
              shape="square"
              style={{border: '1px solid #dedede', borderRadius: '8px', overflow: 'hidden'}}
              size={42}
              src={values.imageUrl}
              icon={<FileImageOutlined />}

            />
          </div>
        )
      },
    },

    //Name column
    {
      title: formatMessage({ id: 'product.name' }),
      key: 'name',
      align: 'left',
      render: values => {
        return (
          
          <div
            style={{
              color:'#3d405b',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
                   
            
                {values.name || ''}
           

          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'product.category' }),
      key: 'category',
      align: 'center',
      render: values => {
        return (
          <div
            style={{
              color:'#3d405b',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {locale === "vi-VN" ? values?.category?.vnName : values?.category?.enName} 
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'product.action' }),
      key: 'action',
      align: 'center',
      render: values => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <Button type="primary" shape="circle" style={{backgroundColor:'#4361ee'}} icon={<EyeOutlined />} onClick={() => {
              history.push(`/product/${values.id}`)
              window.scrollTo(0, 0)
              }}/>
          </div>
        )
      },
    },



  ]
  return (
    <div>
       <Card title={formatMessage({ id: 'product.newProduct' })} style={{ borderRadius: '1rem', boxShadow:'0px 9px 30px rgb(51 83 145 / 8%)'}}>
          <Table
            columns={columns}
            dataSource={listProducts?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))?.slice(0,3)}
            rowKey="id"
            loading={loading}
            pagination={false}
         />
       </Card>
     
    </div>
  )
}


export default connect(
  ({ products, loading }: ConnectState) => ({
    loading: loading.effects['products/getAllProductsModel'],
    listProducts: products?.listProducts || [],
    total: products.total,
  }),
)(ProductNewPage)
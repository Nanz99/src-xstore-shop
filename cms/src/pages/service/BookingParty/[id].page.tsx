import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
import numeral from 'numeral';
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
   history,
   useIntl,
   useParams,
   getLocale,
   CategoryItem,
   connect,
   Dispatch,
} from 'umi';
import {
   Card,
   Button,
   PageHeader,
   Upload,
   Row,
   Col,
   Descriptions,
   Divider,
   Avatar,
   Table,
   Affix,
   message,
   notification,
   Image,
   Modal,
   Tag,
   Space,
   Form,
   Select,
   Radio,
   Skeleton,
   Tabs,
   Empty,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import {
   CheckCircleOutlined,
   FileImageOutlined,
   ExclamationCircleOutlined,
   EditOutlined,
   DeleteOutlined
} from '@ant-design/icons';
// import { getAllCategory } from '@/services/categories.service';
// import { editIsHot } from '@/services/product.service';
import { ConnectState } from '@/models/connect';

import { getDetailOrderService, publishService, unpublishService, deleteOrderService, UpdateStatusOrderService } from '@/services/service.service';

import './index.less';

//=============================================================================================

const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];
const { TabPane } = Tabs

class Params {
   page: number = 1;
   limit: number = 10;
   name?: string;
   verified?: boolean;
}

interface CategoryProp {
   listCategories: CategoryItem[];
   dispatch: Dispatch;
}

const DetailOrderService: React.FC<CategoryProp> = props => {
   const { formatMessage } = useIntl();
   const { id } = useParams();
   const locale = getLocale();
   const { listCategories, dispatch } = props;
   const [detailProduct, setDetailProduct] = useState({});
   const [loadingForm, setLoadingForm] = useState(false);
   const { status, category } = detailProduct;
   console.log("🚀 ~ file: [id].page.tsx ~ line 10000000000 ~ detailProduct", detailProduct)
   const [params, setParams] = useState(new Params());
   const [flag, setFlag] = useState(0);
   const [imageFile, setImageFile] = useState([]);
   const [screenShotFile, setScreenShotFile] = useState([]);
   const [fileList, setFileList] = useState();
   const [visibleEditForm, setVisibleEditForm] = useState(false);
   const [orderStatus, setOrderStatus] = useState('')
   // // const [screenshots , setScreenShots] = useState()


   const config = {
      readonly: true,
      height: 50,
      toolbar: false,
   }

   const fetch = async () => {
      const result = await getDetailOrderService(id);
      if (!result.success) {
         message.error("Whoop! no data");
         history.goBack();

      } else {
         setDetailProduct({ ...result.data });
         setFlag(1);
      }
      await dispatch({
         type: 'category/getAllCategoryModel', payload: {
            page: 1,
            limit: 999999,
         }
      });
   };




   const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
   };

   useMemo(() => {
      fetch();
   }, [id]);

   // useMemo(() => {
   //    if (flag === 1) {
   //       replaceImageProduct(detailProduct);
   //       replaceScreenshotData(detailProduct.screenshots);
   //    }
   // }, [flag])

   //edit ground
   const handleCancel = async () => {
      setVisibleEditForm(false);
      await fetch();
      setLoadingForm(false);
   };

   // const handleCancelForm = async () => {
   //    setVisibleEditForm(false);
   //    setLoadingForm(false);
   //    await fetch();
   // }

   //HANDLE DELETE
   const handleConfirmDelete = id => () => {
      Modal.confirm({
         title: formatMessage({ id: 'service.questorderDelete' }),
         icon: <ExclamationCircleOutlined />,
         onCancel: handleCancel,
         onOk: handleDelete(id),
         okText: formatMessage({ id: 'product.delete' }),
      });
   };

   const handleDelete = id => async () => {
      const { success } = await deleteOrderService(id);
      if (success) {
         notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'service.deleteProductSuccess' }),
         });
         history.push(`/service/booking-party`);
      } else {
         notification.success({
            icon: <CheckCircleOutlined style={{ color: 'red' }} />,
            message: formatMessage({ id: 'service.deleteProductFailed' }),
         });
      }
   };

 
   // const [isModalVisible, setIsModalVisible] = useState(false);

   // const showModal = () => {
   //    setIsModalVisible(true);
   // };

   // const handleOk = () => {
   //    setIsModalVisible(false);
   // };

   // const handleCancel = () => {
   //    setIsModalVisible(false);
   // };


   const handleGetStatus = (status) => {
      setOrderStatus(status)
   }
   useEffect(() => {
      const handleUpdateStatus = async () => {
         let data = {
            orderStatus: orderStatus,
         }
         let res = await UpdateStatusOrderService(detailProduct?.id, data)

         if (res.success) {
            notification.success({
               icon: <CheckCircleOutlined style={{ color: 'green' }} />,
               message: formatMessage({ id: 'service.changeStatusSuccess' }),
            });
            history.go(`/service/booking-party/${detailProduct.id}`)
         } 
      }
      handleUpdateStatus()
   }, [orderStatus])


   return (
      <PageHeaderWrapper>
         <Affix offsetTop={0}>
            <Card >
               <Space size="middle" style={{ float: 'right' }}>
                  {/* <Button
                     onClick={showModal}
                     type="primary"
                     icon={<EditOutlined />}
                  >
                     {formatMessage({ id: 'service.changeStatus' })}
                  </Button> */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '20px' }}>
                     <span style={{ marginRight: '10px' }}>Thay đổi trạng thái: </span>
                     <Select
                        placeholder={formatMessage({ id: 'service.status' })}
                        style={{ width: 200 }}
                        onChange={handleGetStatus}
                        allowClear
                     >
                        <Option value="NEW">
                           {formatMessage({ id: 'service.statusNew' })}
                        </Option>
                        <Option value="DONE">
                           {formatMessage({ id: 'service.statusDone' })}
                        </Option>
                        <Option value="REJECT">
                           {formatMessage({ id: 'service.statusReject' })}
                        </Option>
                     </Select>
                  </div>
                  <Button
                     onClick={handleConfirmDelete(detailProduct.id)}
                     type="danger"
                     icon={<DeleteOutlined />}
                  >
                     {formatMessage({ id: 'product.delete' })}
                  </Button>
               </Space>
            </Card>
         </Affix>

         <Card
         >
            <Row gutter={[16, 16]}>
               <Col span={24}>
                  <Card bordered={false}>
                     {/* Thông tin sản phẩm */}
                     <Row>
                        <h4 style={{ fontSize: '30px', letterSpacing: '1px' }}>Thông tin đơn đặt tiệc</h4>

                        <Col span={24}>
                           <p className="info__text"> #ID : <span className="info__text__detail">{detailProduct?.id}</span> </p>
                           <p className="info__text"> {formatMessage({ id: 'service.fullName' })} : <span className="info__text__detail">{detailProduct?.name}</span> </p>
                           <p className="info__text"> {formatMessage({ id: 'service.email' })} : <span className="info__text__detail">{detailProduct?.email}</span> </p>
                           <p className="info__text"> {formatMessage({ id: 'service.phone' })} : <span className="info__text__detail">{detailProduct?.phone}</span> </p>
                           <p className="info__text"> {formatMessage({ id: 'service.date' })} : <span className="info__text__detail">{detailProduct
                              ? dayjs(detailProduct.date).format(
                                 'DD/MM/YYYY',
                              )
                              : ''}</span> </p>
                           <p className="info__text"> {formatMessage({ id: 'service.quantity' })} : <span className="info__text__detail">{detailProduct?.quantity}</span> </p>

                           <p className="info__text"> {formatMessage({ id: 'service.status' })} : <span >{detailProduct?.status === 0 ? <Tag color="#ffb703" style={{ fontSize: 14 }}>Mới</Tag> : detailProduct?.status === 1 ? <Tag color="#2db7f5" style={{ fontSize: 14 }}>Hoàn Thành</Tag> : detailProduct?.status === 2 ? <Tag color="#f50" style={{ fontSize: 14 }}>Từ Chối</Tag> : ''}</span> </p>



                           <p className="info__text">

                              {formatMessage({ id: 'product.createdAt' })} : {' '}
                              <span className="info__text__detail">  {detailProduct
                                 ? dayjs(detailProduct.createdAt).format(
                                    'DD/MM/YYYY',
                                 )
                                 : ''}</span>

                           </p>

                           {/* <p className="info__text">

                              {formatMessage({ id: 'product.updatedAt' })} : {' '}
                              <span className="info__text__detail">  {detailProduct
                                 ? dayjs(detailProduct.updatedAt).format(
                                    'DD/MM/YYYY',
                                 )
                                 : ''}</span>

                           </p> */}
                        </Col>
                     </Row>

                  </Card>

               </Col>


               {/* <Modal title="Thay đổi trạng thái" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                  <Select
                     placeholder={formatMessage({ id: 'service.status' })}
                     style={{ width: 200 }}
                     onChange={handleGetStatus}
                     allowClear
                  >

                     <Option value="NEW">
                        {formatMessage({ id: 'service.statusNew' })}
                     </Option>
                     <Option value="DONE">
                        {formatMessage({ id: 'service.statusDone' })}
                     </Option>
                     <Option value="REJECT">
                        {formatMessage({ id: 'service.statusReject' })}
                     </Option>
                  </Select>
               </Modal> */}


            </Row>


         </Card>
      </PageHeaderWrapper>
   );
};

export default connect(({ category }: ConnectState) => ({
   listCategories: category?.listCategory || [],
}))(DetailOrderService);

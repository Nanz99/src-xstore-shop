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
// import { ConnectState } from '@/models/connect';
import EditProductForm from './service.edit.page';
import { render } from 'react-dom';
import locale from 'antd/lib/date-picker/locale/en_US';
import { values } from 'lodash';
import { deleteService, getDetailService, publishService, unpublishService } from '../../services/service.service';


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

const DetailService: React.FC<CategoryProp> = props => {
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
  // const [screenshots , setScreenShots] = useState()


  const config = {
    readonly: true,
    height: 50,
    toolbar: false,
  }

  const fetch = async () => {
    const result = await getDetailService(id);
    if (!result.success) {
      message.error("Whoop! no data");
      history.goBack();

    } else {
      const tempArray = result.data.galleries?.map(item => ({ id:item.id, name: item.filename, mediaUrl:item.serviceGalleryUrl }));
      setScreenShotFile(tempArray);
      setDetailProduct({ ...result.data, screenshots: tempArray });
      setFlag(1);
    }
    await dispatch({
      type: 'category/getAllCategoryModel', payload: {
        page: 1,
        limit: 999999,
      }
    });
  };

  const replaceImageProduct = values => {
    try {
      if (values) {
        setImageFile([
          {
            uid: values.id,
            name: values.name,
            status: 'done',
            url: values.imageUrl,
          },
        ])
      }
    } catch (error) {
      return error
    }
  }

  const replaceScreenshotData = values => {
    const array = [];
    for (var i = 0; i < values?.length; i++) {
      const y = {
        uid: values[i].id,
        name: values[i].name,
        status: 'done',
        url: values[i].mediaUrl,
      }
      array.push(y);
    }
    setScreenShotFile(array)
  }

  const handleVisibleEditForm = () => {
    setVisibleEditForm(true);
  };

  

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useMemo(() => {
    fetch();
  }, [id]);

    useMemo(() => {
      if (flag === 1) {
        replaceImageProduct(detailProduct);
        replaceScreenshotData(detailProduct.screenshots);
      }
    }, [flag])

  //edit ground
  const handleCancel = async () => {
    setVisibleEditForm(false);
    await fetch();
    setLoadingForm(false);
  };

  const handleCancelForm = async () => {
    setVisibleEditForm(false);
    setLoadingForm(false);
    await fetch();
  }

  //HANDLE DELETE
  const handleConfirmDelete = id => () => {
    Modal.confirm({
      title: formatMessage({ id: 'service.questDelete' }),
      icon: <ExclamationCircleOutlined />,
      onCancel: handleCancel,
      onOk: handleDelete(id),
      okText: formatMessage({ id: 'product.delete' }),
    });
  };

  const handleDelete = id => async () => {
    const { success } = await deleteService(id);
    if (success) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'service.deleteProductSuccess' }),
      });
      history.push(`/service/service-list`);
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'service.deleteProductFailed' }),
      });
    }
  };

  //HANDLE PUBLISH
  const handlePublish = async (value) => {
    if (value == 1) {
      const { success } = await publishService(id);
      if (success) {
        notification.success({
          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
          message: formatMessage({ id: 'product.publishSuccess' }),
        });
      } else {
        notification.success({
          icon: <CheckCircleOutlined style={{ color: 'red' }} />,
          message: formatMessage({ id: 'product.publishFailed' }),
        });
      }
      await fetch();
    } else {
      const { success } = await unpublishService(id);
      if (success) {
        notification.success({
          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
          message: formatMessage({ id: 'product.unpublishSuccess' }),
        });
      } else {
        notification.success({
          icon: <CheckCircleOutlined style={{ color: 'red' }} />,
          message: formatMessage({ id: 'product.unpublishFailed' }),
        });
      }
      await fetch();
    }
  };

  


  return (
    <PageHeaderWrapper>
      <Affix offsetTop={0}>
        <Card>
          {/* {typeof status === 'number'
            ? (<Radio.Group
              defaultValue={status}
              onChange={e => handlePublish(e.target.value)}
            >
              <Radio value={1}>
                <Tag color="#0070b8">{formatMessage({ id: 'product.publish' })}</Tag>
              </Radio>
              <Radio value={0 || 2}>
                <Tag color="#747474">{formatMessage({ id: 'product.unpublish' })}</Tag>
              </Radio>
            </Radio.Group>)
            : (<Skeleton.Input
              style={{ width: 100 }}
              active={true}
              size="default"
            />)
          } */}

          <Divider type="vertical" style={{ marginRight: 33 }} />



          <Divider type="vertical" style={{ marginRight: 33 }} />



          <Space size="middle" style={{ float: 'right' }}>
            <Button
              onClick={handleVisibleEditForm}
              type="primary"
              icon={<EditOutlined />}
            >
              {formatMessage({ id: 'product.edit' })}
            </Button>
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
                <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    shape="square"
                    size={300}
                    src={detailProduct?.imageUrl}
                    icon={<FileImageOutlined />}
                  />
                </Col>
                <Col span={1}></Col>

                <Col span={15}>
                  <h4 style={{ fontWeight: 'bold', fontSize: 30, letterSpacing: '1px' }}>{detailProduct?.name}</h4>


                  <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                    <i style={{ fontWeight: "lighter", fontSize: 15, marginRight: '10px' }}>
                      {formatMessage({ id: 'product.createdAt' })} : {' '}
                    </i>
                    {detailProduct
                      ? dayjs(detailProduct.createdAt).format(
                        'DD/MM/YYYY',
                      )
                      : ''}
                  </p>
                  <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                    <i style={{ fontWeight: "lighter", fontSize: 15, marginRight: '10px' }}>
                      {formatMessage({ id: 'product.updatedAt' })} : {' '}
                    </i>
                    {detailProduct
                      ? dayjs(detailProduct.updatedAt).format(
                        'DD/MM/YYYY',
                      )
                      : ''}
                  </p>
                  {/* <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                      <i style={{ fontWeight: "lighter", fontSize: 15, marginRight: '10px' }}>
                        {formatMessage({ id: 'product.priceUnit' })} : {' '}
                      </i>
                     VNĐ
                    </p> */}


                  {/* Ảnh sản phẩm */}
                  <Col span={24}>
                    <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }}>
                      <i>{formatMessage({ id: 'service.gallery' })}</i>
                    </Divider>
                    <div style={{ textAlign: "center" }} >
                      {!detailProduct || !detailProduct.galleries || detailProduct.galleries.length == 0
                        ? <Empty />
                        : detailProduct?.galleries?.map((values, index) => (
                          <div style={{ padding: '0 5px', display: 'inline' }} key={index}>
                            <Image
                              src={values?.serviceGalleryUrl}
                              height={100}
                              width={100}
                            />
                          </div>
                        ))}
                    </div>
                  </Col>
                </Col>
              </Row>

            </Card>

          </Col>






          {/* // Cot ben Phai */}
          <Col span={24}>
            {/* <Space size="middle" direction="horizontal"> */}
            <Card bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={8} >
                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }}>
                    <i>{formatMessage({ id: 'product.introduction' })}</i>
                  </Divider>
                  {detailProduct?.introduction ? locale === "en-US" ? (
                    <JoditEditor
                      value={detailProduct.introduction}
                      config={config}
                    />
                  ) : (<JoditEditor
                    toolbar="false"
                    value={detailProduct.vnIntroduction}
                    config={config}
                  />) : ''}
                 
                  <Divider style={{ fontSize: 14, fontWeight: "lighter" }} />

                </Col>
                <Col span={8} >
                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }}>
                    <i>{formatMessage({ id: 'product.description' })}</i>
                  </Divider>
                    {detailProduct?.description ? locale === "en-US" ? (
                   <JoditEditor
                    toolbar="false"
                    value={detailProduct.description}
                    config={config}
                  />
                  ) : ( <JoditEditor
                    toolbar="false"
                    value={detailProduct.vnDescription}
                    config={config}
                  />) : ''}
                  
                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }} />
                 
                </Col>
              </Row>
            </Card>
            {/* </Space> */}
          </Col>
        </Row>

        <Modal
          maskClosable={false}
          visible={visibleEditForm}
          title={formatMessage({ id: 'service.editService' })}
          centered={true}
          onCancel={handleCancelForm}
          width={1000}
          footer={[
            <Button form="product-edit-page" htmlType="button" key="back" onClick={handleCancelForm}>
              {formatMessage({ id: 'product.cancel' })}
            </Button>,
            <Button
              form="product-edit-page"
              htmlType="submit"
              key="submit"
              type="primary"
              loading={loadingForm}
            >
              {''}
              {formatMessage({ id: 'product.edit' })}
              {''}
            </Button>,
          ]}
        >
          <EditProductForm
            detailProduct={detailProduct}
            idProduct={id}
            handleCancel={handleCancel}
            listCategory={listCategories}
            imageFile={imageFile}
            screenShotFile={screenShotFile}
          />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ category }: ConnectState) => ({
  listCategories: category?.listCategory || [],
}))(DetailService);

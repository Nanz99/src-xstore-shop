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
import TypeComponent from '@/components/TypeComponent';
import {
  getDetailProductService,
  editProductService,
  deleteProductService,
  publishProductService,
  unpublishProductService,
  editCondition,
} from '@/services/product.service';
import {
  CloseOutlined,
  CheckCircleOutlined,
  FileImageOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { getAllCategory } from '@/services/categories.service';
import { editIsHot } from '@/services/product.service';
import { ConnectState } from '@/models/connect';
import EditProductForm from './product.edit.page';
import { render } from 'react-dom';
import locale from 'antd/lib/date-picker/locale/en_US';
import { values } from 'lodash';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import { getUniqueValues } from '@/utils/utils';


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

const DetailProduct: React.FC<CategoryProp> = props => {
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const locale = getLocale();
  const { listCategories, dispatch, loading } = props;
  const [detailProduct, setDetailProduct] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const { status, category } = detailProduct;
  console.log("🚀 ~ file: [id].page.tsx ~ line 96 ~ detailProduct", detailProduct)
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
    const result = await getDetailProductService(id);


    if (!result.success) {
      message.error("Whoop! no data");
      history.goBack();

    } else {
      const tempArray = result?.infomations?.map(item => ({ id: item.id, sizeId: item.size.id, colorId: item?.color?.id, weight: item?.weight })).sort((a, b) => a.sizeId - b.sizeId)
      const _salePrice = Number(result?.salePrice)
      const _price = Number(result?.price)
      const saleTagPercent = 100 - ((_salePrice) / (_price)) * 100


      setDetailProduct({ ...result, propertiesProduct: tempArray, saleTag: { number: Number(saleTagPercent) } });
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
    for (var i = 0; i < values.length; i++) {
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

  const handleDeleteProduct = async (id) => {
    await deleteProductService(id)
  }
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    return (
      <Tag color={value} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  }

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
      title: formatMessage({ id: 'product.questDelete' }),
      icon: <ExclamationCircleOutlined />,
      onCancel: handleCancel,
      onOk: handleDelete(id),
      okText: formatMessage({ id: 'product.delete' }),
    });
  };

  const handleDelete = id => async () => {
    const { success } = await deleteProductService(id);
    if (success) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'product.deleteProductSuccess' }),
      });
      history.push(`/product`);
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'product.deleteProductFailed' }),
      });
    }
  };

  //HANDLE PUBLISH
  const handlePublish = async (value) => {
    if (value == 1) {
      const { success } = await publishProductService(id);
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
      const { success } = await unpublishProductService(id);
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

  const handleChangeCondition = async (value) => {
    const data = { condition: value }
    const res = await editCondition(id, data);
    if (res && res.success) {
      message.success(formatMessage({ id: 'product.changeConditonSuccess' }));
    } else {
      message.success(formatMessage({ id: 'product.changeConditonError' }));
    }
  }
  const handleChangeIsHot = async (value) => {
    const data = { isHot: value }
    const res = await editIsHot(id, data);
    if (res && res.success) {
      message.success(formatMessage({ id: 'product.changeConditonSuccess' }));
    } else {
      message.success(formatMessage({ id: 'product.changeConditonError' }));
    }
  }



  const columns: any = [
    //Index column
    {
      title: formatMessage({ id: 'product.index' }),
      key: 'ID',
      align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: formatMessage({ id: 'product.size' }),
      align: 'center',
      key: 'size',
      render: values => {
        return (
          <div>
            {values?.size?.size}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'product.color' }),
      key: 'color',
      align: 'center',
      render: values => {
        return (
          <div>
            {values?.color && values?.color !== null && values?.color !== undefined ? <div style={{ width: '30px', height: '30px', border: '1px solid #dedede', display: 'inline-block', marginLeft: '8px', borderRadius: '4px', backgroundColor: `${values?.color?.color}` }}>
            </div> : null}
          </div>

        )
      },
    },
    {
      title: formatMessage({ id: 'product.weight' }),
      key: 'weight',
      align: 'center',
      render: values => {
        return (
          <div>
            {values?.weight} g
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'product.availableQuantity' }),
      key: 'weight',
      align: 'center',
      render: values => {
        return (
          <div>
            {values?.availableQuantity}
          </div>
        )
      },
    },
  ]
  return (
    <PageHeaderWrapper>
      <Affix offsetTop={0}>
        <Card>
          {typeof status === 'number'
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
          }

          <Divider type="vertical" style={{ marginRight: 33 }} />

          {/* Condition Tag */}
          {typeof detailProduct.condition === 'number'
            ? (<Radio.Group
              defaultValue={detailProduct.condition}
              onChange={e => handleChangeCondition(e.target.value)}
            >
              <Radio value={1}>
                <Tag color="#fbbc05">{formatMessage({ id: 'product.conditionNEW' })}</Tag>
              </Radio>
              <Radio value={0}>
                <Tag color="#747474">{formatMessage({ id: 'product.conditionNORMAL' })}</Tag>
              </Radio>
            </Radio.Group>)
            : (<Skeleton.Input
              style={{ width: 100 }}
              active={true}
              size="default"
            />)
          }

          <Divider type="vertical" style={{ marginRight: 33 }} />

          {/* isHot Tag */}
          {typeof detailProduct.isHot === 'boolean'
            ? (<Radio.Group
              defaultValue={detailProduct.isHot}
              onChange={e => handleChangeIsHot(e.target.value)}
            >
              <Radio value={true}>
                <Tag color="#ea4335">{formatMessage({ id: 'product.isHotYes' })}</Tag>
              </Radio>
              <Radio value={false}>
                <Tag color="#747474">{formatMessage({ id: 'product.isHotNo' })}</Tag>
              </Radio>
            </Radio.Group>)
            : (<Skeleton.Input
              style={{ width: 100 }}
              active={true}
              size="default"
            />)
          }

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
                    size={370}
                    src={detailProduct?.imageUrl}
                    icon={<FileImageOutlined />}
                  />
                </Col>
                <Col span={1}></Col>

                <Col span={15}>
                  <h4 style={{ fontWeight: 'bold', fontSize: 30, letterSpacing: '1px' }}>{detailProduct?.name}</h4>
                  <Row>
                    <Col span={12}>
                      <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                        <span style={{ fontWeight: 400, fontSize: 15, marginRight: '10px' }}>{formatMessage({ id: 'product.providerName' })}:</span>
                        {detailProduct ? detailProduct.providerName : ''}
                      </p>
                      <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                        <span style={{ fontWeight: 400, fontSize: 15, marginRight: '10px' }}>{formatMessage({ id: 'product.category' })}:</span>
                        {category ? locale === "en-US" ? category.enName : category.vnName : ''}
                      </p>

                      <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                        <i style={{ fontWeight: 400, fontSize: 15, marginRight: '10px' }}>
                          {formatMessage({ id: 'product.createdAt' })} : {' '}
                        </i>
                        {detailProduct
                          ? dayjs(detailProduct.createdAt).format(
                            'DD/MM/YYYY',
                          )
                          : ''}
                      </p>
                      <p style={{ textAlign: "left", fontWeight: "bolder", fontSize: 16 }}>
                        <i style={{ fontWeight: 400, fontSize: 15, marginRight: '10px' }}>
                          {formatMessage({ id: 'product.updatedAt' })} : {' '}
                        </i>
                        {detailProduct
                          ? dayjs(detailProduct.updatedAt).format(
                            'DD/MM/YYYY',
                          )
                          : ''}
                      </p>
                    </Col>
                    <Col span={12}>


                      <div>
                        <p style={{ fontSize: '16px' }}>Chi phí đại lý: <Tag color="#2db7f5" style={{ fontSize: 14 }}>  {numeral(detailProduct?.dealerPrice).format(0, 0) || ''} đ</Tag></p>
                        <p style={{ fontSize: '16px' }}>Giá bán: <Tag color="#2db7f5" style={{ fontSize: 14 }}>  {numeral(detailProduct?.price).format(0, 0) || ''} đ</Tag></p>
                        <p style={{ fontSize: '16px' }}>Giá khuyến mãi :  <Tag color="#f50" style={{ fontSize: 14 }}> {numeral(detailProduct?.salePrice).format(0, 0) || ''} đ</Tag></p>
                      </div>
                    </Col>
                  </Row>



                  {/* Ảnh sản phẩm */}
                  <Col span={24}>
                    <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }}>
                      <i>{formatMessage({ id: 'product.screenshot' })}</i>
                    </Divider>
                    <div style={{ textAlign: "center" }} >
                      {!detailProduct || !detailProduct.screenshots || detailProduct.screenshots.length == 0
                        ? <Empty />
                        : detailProduct.screenshots.map((values, index) => (
                          <div style={{ padding: '0 5px', display: 'inline' }} key={index}>
                            <Image
                              src={values?.mediaUrl}
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



          {/* Kích cỡ và màu sắc */}
          <Table
            style={{ width: '100%', margin: '20px 20px 0 20px' }}
            columns={columns}
            dataSource={detailProduct?.infomations}
            rowKey="id"
            loading={loading}
            scroll={{ x: 768 }}
            bordered
            pagination={false}

          />


          {/* // Cot ben Phai */}
          <Col span={24}>
            {/* <Space size="middle" direction="horizontal"> */}
            <Card bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={8} >
                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }}>
                    <i>{formatMessage({ id: 'product.introduction' })}</i>
                  </Divider>
                  {detailProduct ? locale === 'en-US' ? (<JoditEditor
                    value={detailProduct.introduction}
                    config={config}
                  />) : (<JoditEditor
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
                  {detailProduct ? locale === "en-US" ? (<JoditEditor
                    toolbar="false"
                    value={detailProduct.description}
                    config={config}
                  />) : (<JoditEditor
                    toolbar="false"
                    value={detailProduct.vnDescription}
                    config={config}
                  />) : ''}

                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }} />

                </Col>
                <Col span={8} >
                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }}>
                    <i>{formatMessage({ id: 'product.specifications' })}</i>
                  </Divider>

                  {detailProduct ? locale === "en-US" ? (<JoditEditor
                    toolbar="false"
                    value={detailProduct?.specifications}
                    config={config}
                  />) : (<JoditEditor
                    toolbar="false"
                    value={detailProduct?.vnSpecifications}
                    config={config}
                  />) : ''}

                  <Divider plain style={{ fontSize: 14, fontWeight: "lighter" }} />

                  {/* <Tabs activeKey={locale}>
                      <TabPane key="vi-VN" style={{outline: 'none'}}>
                        <JoditEditor
                          toolbar="false"
                          value={detailProduct.vnSpecifications}
                          config={config}
                        />
                      </TabPane>
                      <TabPane key="en-US">
                        <JoditEditor
                          toolbar="false"
                          value={detailProduct.specifications}
                          config={config}
                        />
                      </TabPane>
                    </Tabs> */}
                </Col>
              </Row>
            </Card>
            {/* </Space> */}
          </Col>
        </Row>

        <Modal
          maskClosable={false}
          visible={visibleEditForm}
          title={formatMessage({ id: 'product.editProduct' })}
          centered={true}
          onCancel={handleCancelForm}
          width={1200}
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

export default connect(({ loading, category, products }: ConnectState) => ({
  loading: loading.effects['products/getAllProductsModel'],
  listProducts: products?.listProducts || [],
  total: products.total,
  listCategories: category?.listCategory || [],
}))(DetailProduct);

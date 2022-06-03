import { Card, Col, DatePicker, Row, Table } from 'antd'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useIntl } from 'umi'
import { FormattedMessage } from 'umi'
import numeral from 'numeral'
import './styles.less'
import imagelogo from '../../assets/logo-footer.png'
import dayjs from 'dayjs'

class ComponentToPrint extends React.Component {
  // const { buyer, orderProducts, detailOrder } = props
  // formatMessage = useIntl()
  index = 0
  constructor(props) {
    super(props)
  }

  getDateTime() {
    var today = new Date()
    var date =
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    var dateTime = date + ' ' + time
    return dateTime
  }



  columns = [
    {
      title: <p className="col-head border-0">STT</p>,
      render: (v, t, i) => <p className="border-0">{i + 1}</p>,
    },
    {
      title: <p className="col-head border-0 text-center">Tên sản phẩm</p>,
      align: 'center',
      key: 'name',
      render: detailOrder => {
        return (
          <div className="border-0">
            <p>{detailOrder?.productInfo?.product?.name}</p>
          </div>
        )
      },
    },
    {
      title: <p className="col-head border-0 text-center">Size</p>,
      align: 'center',
      key: 'size',
      render: detailOrder => {
        return (
          <div className="border-0">
            <p>{detailOrder?.productInfo?.size?.size}</p>
          </div>
        )
      },
    },
    {
      title: <p className="col-head border-0 text-center">Màu</p>,
      align: 'center',
      render: detailOrder => {
        return (
          <>
            <div className="border-0">
            <p>{detailOrder?.productInfo?.color?.description}</p>
          </div>
          </>
        )
      },
    },
    {
      title: <p className="col-head border-0 text-center">Giá</p>,
      align: 'center',
      key: 'Price',
      render: detailOrder => {
        return (
          <div className="border-0">
            <p>
              {' '}
              {numeral(detailOrder?.salePrice).format(0, 0) || ''} đ
            </p>
          </div>
        )
      },
    },
    {
      title: <p className="col-head border-0 text-center">Số Lượng</p>,
      align: 'center',
      key: 'quantity',
      render: detailOrder => (
        <p className="border-0 text-center">{detailOrder?.quantity}</p>
      ),
    },
    {
      title: (
        <p className="col-head border-0 text-right">
          <FormattedMessage id="order.invoiceAmount" defaultMessage="Amount" />
        </p>
      ),
      render: detailOrder => (
        <p className="border-0 text-right">
          {numeral(detailOrder?.salePrice * detailOrder.quantity).format(
            0,
            0,
          ) || ''}{' '}
          đ
        </p>
      ),
    },
  ]

  
  render() {
    let arrOrderProduct = this.props?.orderProducts?.filter(item => item.quantity > 0)
    let calculateTotal = this.props?.orderProducts?.reduce(
      (a, c) => a + c.quantity * c.retailPrice,
      0,
    )
    console.log(this.props.detailOrder)
    let khuyenmai =
      Number(calculateTotal) - Number(this.props.detailOrder.grandTotal)
    return (
      <div hidden={false}>
        {/* Container */}
        <div className="invoice-container border-0">
          {/* Header */}
          <header>
            <div className="row align-items-center mg-4">
              <div className="col-sm-10 text-center text-sm-left mb-3 mb-sm-0 img-logo">
                <img id="logo" src="logoMMN.png" alt="logoInvoice"  />
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#333',
                  }}
                ></div>
              </div>
              <div className="col-sm-10 text-center text-sm-right">
                <h4 className="title__big">Hóa Đơn</h4>
              </div>
            </div>
          </header>
          {/* Main Content */}
          <main>
            <div className="row">
              <div className="infomation">
                <p className="info__text">
                  ID: <span>#{this.props.detailOrder.id}</span>
                </p>

                <p className="info__text">
                  Ngày đặt:{' '}
                  <span>
                    {dayjs(this.props.detailOrder.createdAt).format(
                      'DD/MM/YYYY',
                    )}
                  </span>
                </p>

                <p className="info__text">
                  Ngày giao:{' '}
                  <span>
                    #
                    {dayjs(this.props.detailOrder.createdAt).format(
                      'DD/MM/YYYY',
                    )}
                  </span>
                </p>
                <h4 className="info__title__medium">Thông tin khách hàng</h4>
                <p className="info__text">
                  Họ và Tên: <span>{this.props.detailOrder.fullName}</span>
                </p>
                <p className="info__text">
                  Email: <span>{this.props.detailOrder.email}</span>
                </p>
                <p className="info__text">
                  Số điện thoại: <span>{this.props.detailOrder.phone}</span>
                </p>
                <p className="info__text">
                  Địa chỉ:{' '}
                  <span>
                    {this.props.detailOrder.address},
                    {' ' + this.props.detailOrder.ward},
                    {' ' + this.props.detailOrder.district},
                    {' ' + this.props.detailOrder.city},
                    {' ' + this.props.detailOrder.country}.
                  </span>
                </p>
              </div>
            </div>

            <div className="row ">
              {/* <div className="col-sm-6 text-sm-right order-sm-1"> <strong>Pay To:</strong>
              <address>
                Koice Inc<br />
                2705 N. Enterprise St<br />
                Orange, CA 92865<br />
                contact@koiceinc.com
              </address>
            </div> */}
              {/* <div className="col-sm-6 order-sm-0">
                {' '}
                <strong>
                  <FormattedMessage
                    id="order.invoiceInvoicedTo"
                    defaultMessage="Invoiced To"
                  />
                  :
                </strong>
                <address>
                  {this.props.buyer.firstName}&nbsp;{this.props.buyer.lastName}
                  <br />
                  {this.props.buyer.address}
                  <br />
                  {this.props.buyer.phone}
                  <br />
                  {this.props.buyer.email}
                </address>
              </div> */}
            </div>
            <div className="card mt-3">
              <div className="card-header px-2 py-0">
                <Table
                  className="table mb-0"
                  columns={this.columns}
                  dataSource={arrOrderProduct}
                  pagination={false}
                />
              </div>
              <div className="card-body px-2">
                <div className="table-responsive">
                  <table className="table">
                    <Row>
                      <br />
                    </Row>
                    {/* <Row className="col-head">
                      <Col span={20} className="bg-light-2 text-right">
                        <FormattedMessage
                          id="order.invoiceSubTotal"
                          defaultMessage="Sub total"
                        />
                        :
                      </Col>
                      <Col span={4} className="bg-light-2 text-right">
                        <p>
                          {numeral(this.props.detailOrder.subTotal).format(
                            0,
                            0,
                          ) || 0}{' '} 
                          đ
                        </p>
                      </Col>
                    </Row> */}
                    <Row className="col-head">
                      <Col span={20} className="bg-light-2 text-right">
                        <FormattedMessage
                          id="stockout.subTotal"
                        />
                        :
                      </Col>
                      <Col span={4} className="bg-light-2 text-right">
                        <p> {numeral(this.props.detailOrder?.subTotal).format(
                          0,
                          0,
                        ) || 0}{' '}
                          đ</p>
                      </Col>
                    </Row>
                    <Row className="col-head">
                      <Col span={20} className="bg-light-2 text-right">
                        <FormattedMessage
                          id="stockout.shippingPrice"
                        />
                        :
                      </Col>
                      <Col span={4} className="bg-light-2 text-right">
                        <p> {numeral(this.props.detailOrder?.shippingFee).format(
                          0,
                          0,
                        ) || 0}{' '}
                          đ</p>
                      </Col>
                    </Row>
                    <Row className="col-head">
                      <Col span={20} className="bg-light-2 text-right">
                        <FormattedMessage
                          id="stockout.grandTotal"
                          defaultMessage="Total"
                        />
                        :
                      </Col>
                      <Col span={4} className="bg-light-2 text-right">
                        <p>
                          {numeral(this.props.detailOrder.grandTotal).format(
                            0,
                            0,
                          )}{' '}
                          đ
                        </p>
                      </Col>
                    </Row>
                  </table>
                </div>
              </div>
            </div>
          </main>
          {/* Footer */}
          <footer className="text-center mt-4 footer-container" >
            <div >
              <p>Address : 205c - Phạm Văn Thuận - Phường Tân Tiến - Biên Hoà - Đồng Nai</p>
              <p>Điện thoại: (+84) 899 199 956</p>
              <p>Contact email: minhminhanhltd@gmail.com</p>
              
            </div>
              <div className="copyright">
              <p>Copyright (c) {new Date().getFullYear()} <span style={{fontWeight: 600, color: "#fff"}}>MMN</span>  . All rights reserved.</p>
            </div>
          </footer>
          
        </div>
      </div>
    )
  }
}

export default ComponentToPrint

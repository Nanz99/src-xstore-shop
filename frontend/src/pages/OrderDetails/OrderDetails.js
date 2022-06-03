
import Meta from 'components/Meta/Meta'
import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { detailsOrder } from 'actions/orderActions';
import { useSelector } from 'react-redux';
import Loading from 'components/Loading/Loading';
import { formatPrice } from 'utils/helper';
import dateFormat from 'dateformat'
import './OrderDetails.css'

function OrderDetails(props) {
	const orderId = props.match.params.id
	const dispatch = useDispatch();
	const { order, orderItems, checkoutDetails } = useSelector((state) => state.orderDetails);
	

	useEffect(() => {
		dispatch(detailsOrder(orderId))
	}, [dispatch, orderId])

	if (!order) return <Loading />;
	return (
		<div>
			<Meta title="Chi tiết đơn hàng" />
			<div className="">
				<h2 className="tracking-wider text-2xl mb-10 font-semibold">
					Mã số đơn hàng : {order._id}
				</h2>

				<div className="">
					<div className="">

						<div className="p-10 border border-gray border-solid ">
							<h2 className="text-xl font-semibold capitalize mb-5 ">
								Thông tin người nhận
							</h2>
							<div>
								<p className="p-3 border-b border-gray-7 border-solid  ">
									<span className="font-semibold tracking-wider">
										Họ Và Tên:{" "}
									</span>{" "}
									<span className="tracking-wider">
										{order.checkoutDetails.fullname}
									</span>
								</p>
								{order.checkoutDetails.numberPhone && (
									<p className="p-3 border-b border-gray-7 border-solid ">
										<span className="font-semibold tracking-wider">
											Số Điện Thoại:{" "}
										</span>{" "}
										<span className="tracking-wider">
											(+84) {order.checkoutDetails.numberPhone}
										</span>
									</p>
								)}
								{order.checkoutDetails.email && (
									<p className="p-3 border-b border-gray-7 border-solid ">
										<span className="font-semibold tracking-wider">
											Email:{" "}
										</span>{" "}
										<span className="tracking-wider">
											{order.checkoutDetails.email}
										</span>
									</p>
								)}

								<p className="p-3 border-b border-gray-7 border-solid ">
									<span className="font-semibold tracking-wider">
										Địa Chỉ Giao Hàng:{" "}
									</span>{" "}
									<span className="tracking-wider">
										{order.checkoutDetails.address},{" "}
										{order.checkoutDetails.wardsCustomer},{" "}
										{order.checkoutDetails.districtCustomer},{" "}
										{order.checkoutDetails.provinceCustomer}
									</span>
								</p>
								{order.checkoutDetails.noteOrder && (
									<p className="p-3 border-b border-gray-7 border-solid ">
										<span className="font-semibold tracking-wider">
											Ghi chú:{" "}
										</span>{" "}
										<span className="tracking-wider">
											{order.checkoutDetails.noteOrder}
										</span>
									</p>
								)}
							</div>
						</div>
						<div className="p-10 border border-gray border-solid my-10">
							<h2 className="text-xl font-semibold capitalize mb-5 ">
								Phương Thức Thanh Toán
							</h2>
							<p className="py-3">
								<span className="tracking-wider text-red-1 ">
									{order.checkoutDetails.paymentMethod}
								</span>
							</p>
							<p className="pb-3">
								<span className="tracking-wider font-semibold mr-2">Trạng Thái:</span>
								<span>{`${order.isPaid ? "Đã Thanh toán " : "Chưa Thanh Toán"}`}</span>

							</p>
							{order.paidAt && (
								<p className="pb-3">
									<span className="tracking-wider font-semibold mr-2">Thời gian thanh toán:</span>
									<span>{`${dateFormat(order.paidAt, "HH:MM  dd-mm-yyyy")}`}</span>

								</p>
							)
							}
						</div>


						<div className="p-10 border border-gray border-solid">
							<h2 className="text-xl font-semibold capitalize mb-5">
								Đơn Hàng của bạn
							</h2>
							<div className="mb-7">
								<div>
									<div className="flex justify-between mb-5">
										<span className="font-semibold">Sản Phẩm</span>
										<span className="font-semibold">Tạm Tính </span>
									</div>
									{orderItems.map((item) => {
										return (
											<div
												key={item.product}
												className="flex justify-between items-center border-gray-7 py-2 border-t border-solid"
											>
												<div className="pr-3">
													<div className="flex items-center">
														<img src={item.image && item.image.url} alt="" className="w-20 block border-2 border-solid border-red-1" />
														<div className="ml-5">
															<p>{item.name}</p>
															<p className="mt-2">
																<i className="material-icons text-10">close</i>
																{item.amount}
															</p>
														</div>
													</div>
													{" "}

												</div>
												<div>
													{formatPrice(
														Number(item.amount) * Number(item.price)
													)}
												</div>
											</div>
										);
									})}
								</div>
								<div className="flex justify-between py-4 border-gray-7 border-t border-solid padding-s">
									<span className="font-semibold"> Tổng tiền : </span>{" "}
									<span>{formatPrice(checkoutDetails.totalPrice)}</span>
								</div>
								<div className="flex justify-between py-4 border-gray-7 border-t border-solid padding-s">
									<span className="font-semibold"> Phí Giao Hàng : </span>
									<span>{formatPrice(checkoutDetails.shippingFee)}</span>
								</div>
								<div className="flex justify-between pt-6 border-gray-7 border-t border-solid padding-s">
									<span className="font-semibold"> Tổng Đơn Hàng : </span>
									<span className="text-red-1 font-semibold">{formatPrice(checkoutDetails.totalOrder)}</span>
								</div>
							</div>


						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

export default OrderDetails

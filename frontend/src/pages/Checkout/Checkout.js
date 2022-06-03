import axios from "axios"
import React, { useEffect, useState } from "react"
import Meta from "../../components/Meta/Meta"
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb"
import paypal from "../../assets/images/thanh-toan/paypal.jpg"
import vnpayimg from "../../assets/images/thanh-toan/vnpay.png"
import { useDispatch, useSelector } from "react-redux"
import { formatPrice } from "./../../utils/helper"
import { createOrder } from "../../actions/orderActions"
import { ORDER_PAY_RESET } from "../../constants/orderConstants"

function Checkout(props) {
	const cart = useSelector((state) => state.cart)
	const { cartItems } = cart
	const { order, success: successCreate } = useSelector(
		(state) => state.orderCreate
	)

	const { userInfo } = useSelector((state) => state.userSignin)

	if (!userInfo) {
		props.history.push("/dang-nhap")
	}

	if (cartItems && cartItems.length === 0) {
		props.history.push("/gio-hang")
	}
	const dispatch = useDispatch()

	const totalPrice = cartItems.reduce((a, c) => a + c.price * c.amount, 0)
	const shippingFee = totalPrice > 500000 ? 0 : 25000
	const totalOrder = totalPrice + shippingFee

	const [province, setProvince] = useState("")
	const [provinceCode, setProvinceCode] = useState("")
	const [district, setDistrict] = useState("")
	const [districtCode, setDistrictCode] = useState("")
	const [wards, setWards] = useState("")

	//Order info
	const [fullname, setFullname] = useState("")
	const [numberPhone, setNumberPhone] = useState("")
	const [email, setEmail] = useState("")
	const [noteOrder, setNoteOrder] = useState("")
	const [company, setCompany] = useState("")
	const [provinceCustomer, setProvinceCustomer] = useState()
	const [districtCustomer, setDistrictCustomer] = useState()
	const [wardsCustomer, setWardsCustomer] = useState()
	const [address, setAddress] = useState("")
	const [paymentMethod, setPaymentMethod] = useState("")

	useEffect(() => {
		dispatch({ type: ORDER_PAY_RESET })
	}, [dispatch])

	useEffect(() => {
		axios.get("https://provinces.open-api.vn/api/p").then((res) => {
			setProvince(res.data)
		})

		if (provinceCode) {
			axios
				.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
				.then((res) => {
					setDistrict(res.data.districts)
					setProvinceCustomer(res.data.name)
				})
		}
		if (districtCode) {
			axios
				.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
				.then((res) => {
					setWards(res.data.wards)
					setDistrictCustomer(res.data.name)
				})
		}
	}, [provinceCode, districtCode])

	const submitHandler = (e) => {
		e.preventDefault()
		const data = {
			paymentMethod,
			fullname,
			numberPhone,
			email,
			company,
			provinceCustomer,
			districtCustomer,
			wardsCustomer,
			address,
			noteOrder,
			totalPrice,
			shippingFee,
			totalOrder,
		}
		dispatch(
			createOrder({
				...cart,
				orderItems: cart.cartItems,
				checkoutDetails: data,
			})
		)
	}
	useEffect(() => {
		if (successCreate) {
			props.history.push(`/payment/pay-order/${order._id}`)
		}
	}, [dispatch, successCreate, props.history, order])

	return (
		<div>
			<Meta title='Thanh Toán' />
			<Breadcrumb title='Thanh Toán' />
			<form action='' onSubmit={submitHandler}>
				<div className='py-20 px-8 grid grid-cols-2'>
					<div className='pr-5'>
						<h2 className='text-xl font-semibold capitalize mb-5 '>
							Thông Tin Thanh Toán
						</h2>

						<div className='flex items-center'>
							<div className='mb-5 mx-3'>
								<label htmlFor='hovaten'>
									Họ và Tên <span className='text-red-600'>*</span>
								</label>
								<input
									className='block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
									type='text'
									id='hovaten'
									placeholder='Nhập Họ và Tên'
									value={fullname}
									required
									onChange={(e) => setFullname(e.target.value)}
								/>
							</div>
							<div className='mb-5 mx-3'>
								<label htmlFor='sodienthoai'>
									Số điện thoại <span className='text-red-600'>*</span>
								</label>
								<input
									className='block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
									type='phone'
									placeholder='Nhập Số Điện Thoại'
									onChange={(e) => setNumberPhone(e.target.value)}
								/>
							</div>
						</div>

						<div className='flex items-center '>
							<div className='mb-5 mx-3'>
								<label htmlFor='email'>
									Địa chỉ Email <span className='text-red-600'>*</span>
								</label>
								<input
									className='block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
									type='email'
									id='email'
									placeholder='Nhập Email'
									// value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<div className='mb-5 mx-3'>
									<label htmlFor='company'>Công ty (nếu có)</label>
									<input
										className='block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
										type='text'
										id='company'
										placeholder='Nhập Tên Công Ty'
										onChange={(e) => setCompany(e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div className='flex items-center'>
							<div className='mb-5 mx-3'>
								<label className='block text-left'>
									<span className='text-gray-700'>
										Tỉnh/ thành phố{" "}
										<span className='text-red-600'>*</span>
									</span>
									<select
										className='block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent '
										onChange={(e) => setProvinceCode(e.target.value)}
									>
										<option value=''></option>
										{province &&
											province.map((x, index) => {
												return (
													<option key={index} value={x.code}>
														{x.name}
													</option>
												)
											})}
									</select>
								</label>
							</div>
							{/* Quận Huyện */}
							<div className='mb-5 mx-3'>
								<label className='block text-left'>
									<p className='text-gray-700'>
										Quận huyện <span className='text-red-600'>*</span>
									</p>
									<select
										className='block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
										onChange={(e) => setDistrictCode(e.target.value)}
									>
										<option value=''></option>
										{district &&
											district.map((x, index) => {
												return (
													<option key={index} value={x.code}>
														{x.name}
													</option>
												)
											})}
									</select>
								</label>
							</div>
						</div>
						{/* Phường Xã */}
						<div className='flex items-center'>
							<div className='mb-5 mx-3'>
								<label className='block text-left'>
									<p className='text-gray-700'>
										Phường Xã <span className='text-red-600'>*</span>
									</p>
									<select
										className=' block w-64 border mt-1 text-15 border-solid border-black py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
										onClick={(e) => setWardsCustomer(e.target.value)}
									>
										<option value=''></option>
										{wards &&
											wards.map((x, index) => {
												return (
													<option key={index} value={x.name}>
														{x.name}
													</option>
												)
											})}
									</select>
								</label>
							</div>
							<div className='mb-5 mx-3'>
								<label htmlFor='diachigiaohang'>
									Địa Chỉ Giao Hàng
									<span className='text-red-600'>*</span>{" "}
								</label>
								<input
									className='block w-64 border mt-1 text-15 border-solid border-black  py-2 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent'
									type='text'
									id='diachigiaohang'
									required
									placeholder='Nhập Địa Chỉ Giao Hàng'
									onChange={(e) => setAddress(e.target.value)}
								/>
							</div>
						</div>

						<textarea
							className='block w-full mx-3 h-44 mt-8 border border-solid p-3 border-black rounded-none outline-none focus:border-red-1'
							name='thongtinbosung'
							id='thongtinbosung'
							placeholder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
							value={noteOrder}
							onChange={(e) => setNoteOrder(e.target.value)}
						/>
					</div>

					<div className='p-10 ml-5 border border-gray border-solid'>
						<h2 className='text-xl font-semibold capitalize mb-5'>
							Đơn Hàng của bạn
						</h2>
						<div className='mb-7'>
							<div>
								<div className='flex justify-between mb-5'>
									<span className='font-semibold'>Sản Phẩm</span>
									<span className='font-semibold'>Tạm Tính </span>
								</div>
								{cartItems.map((item) => {
									return (
										<div
											key={item.product}
											className='flex justify-between border-gray-7 py-2 border-t border-solid'
										>
											<span className='pr-3'>
												{item.name}{" "}
												<span className='ml-3'>
													<i className='material-icons text-10'>
														close
													</i>
													{item.amount}
												</span>{" "}
											</span>
											<span>
												{formatPrice(
													Number(item.amount) * Number(item.price)
												)}
											</span>
										</div>
									)
								})}
							</div>
							<div className='flex justify-between py-4 border-gray-7 border-t border-solid'>
								<span className='font-semibold'> Tổng tiền : </span>{" "}
								<span>{formatPrice(totalPrice)}</span>
							</div>
							<div className='flex justify-between py-4 border-gray-7 border-t border-solid'>
								<span className='font-semibold'> Phí Giao Hàng : </span>
								<span>{formatPrice(shippingFee)}</span>
							</div>
							<div className='flex justify-between pt-6 border-gray-7 border-t border-solid'>
								<span className='font-semibold'> Tổng Đơn Hàng : </span>
								<span>{formatPrice(totalOrder)}</span>
							</div>
						</div>
						<div className=''>
							<h2 className='text-xl font-semibold capitalize mb-5'>
								Phương Thức Thanh Toán
							</h2>
							<ul className='mb-5'>
								<li className='my-4'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio '
											name='paymentMethod'
											value='Thanh Toán Khi Nhận Hàng'
											onChange={(e) =>
												setPaymentMethod(e.target.value)
											}
										/>
										<span className='ml-2 capitalize'>
											Thanh Toán Khi Nhận Hàng
										</span>
									</label>
								</li>
								<li className='my-3'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio'
											name='paymentMethod'
											value='Chuyển Khoản Ngân Hàng'
											onChange={(e) =>
												setPaymentMethod(e.target.value)
											}
										/>
										<span className='ml-2 capitalize'>
											Chuyển Khoản Ngân Hàng
										</span>
									</label>
								</li>

								<li className='my-3'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio'
											name='paymentMethod'
											value='Thanh Toán Qua VNPAY'
											onChange={(e) =>
												setPaymentMethod(e.target.value)
											}
										/>
										<span className='ml-2 capitalize flex items-center'>
											<span className='mr-2'>
												Thanh Toán Qua VNPAY
											</span>
											<img
												src={vnpayimg}
												alt=''
												className='w-10 h-10 block'
											/>
										</span>
									</label>
								</li>
								<li className='my-3'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio'
											name='paymentMethod'
											value='Paypal'
											onChange={(e) =>
												setPaymentMethod(e.target.value)
											}
										/>
										<span className='ml-2 capitalize inline-block'>
											{" "}
											<img src={paypal} alt='' />
										</span>
									</label>
								</li>
							</ul>

							{paymentMethod === "Paypal" ? (
								<button
									type='submit'
									className='px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white'
								// onClick={paymentWithPaypal}
								>
									Thanh Toán với Paypal
								</button>
							) : paymentMethod === "Thanh Toán Qua VNPAY" ? (
								<button
									type='submit'
									className='px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white'
								>
									Thanh Toán Qua VNPAY
								</button>
							) : paymentMethod === "Chuyển Khoản Ngân Hàng" ? (
								<button
									type='submit'
									className='px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white'
								>
									Chuyển Khoản Ngân Hàng
								</button>
							) : (
								<button
									type='submit'
									className='px-8 py-2 bg-transparent border-2 border-solid border-black hover:border-red-1 hover:bg-red-1 hover:text-white'
								// onClick={placeOrder}
								>
									Đặt Hàng
								</button>
							)}
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default Checkout

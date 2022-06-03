import Breadcrumb from "components/Breadcrumb/Breadcrumb"
import OrderDetails from "pages/OrderDetails/OrderDetails"
import OrderHistory from "pages/OrderHistory/OrderHistory"
import React from "react"
import { Link, Switch, Route } from "react-router-dom"
import AvatarDefault from "../../assets/images/avatar-default.png"
import Address from "./Address/Address"
import Profile from "./Profile/Profile"
import Wishlist from "./Wishlist/Wishlist"

function Account() {
	return (
		<div>
			<Breadcrumb title='Tài Khoản Của Tôi' />
			<div className='grid grid-cols-2-20-80 py-12 px-44 gap-x-16'>
				<div className='border border-solid border-gray-8 rounded-md'>
					<div className='avatar p-12  border-b border-gray-8 tracking-wider m-auto flex justify-center ' >
						<img src={AvatarDefault} alt='' className='h-28 w-28 block rounded-full border-4 border-double border-gray-8' />
					</div>
					<ul>
						<li className='p-4  border-solid border-b border-gray-8 tracking-wider font-medium'>
							<Link
								to='/user/account/profile'
								className='flex items-center'
							>
								{" "}
								<i className='material-icons mr-2 text-xl'>person</i> Hồ Sơ
							</Link>
						</li>
						<li className='p-4 border-solid border-b border-gray-8 tracking-wider font-medium'>
							<Link
								to='/user/account/address'
								className='flex items-center'
							>
								<i className='material-icons mr-2 text-xl'>place</i> Địa Chỉ
							</Link>
						</li>

						<li className='p-4  border-solid border-b border-gray-8 tracking-wider font-medium'>
							<Link
								to='/user/account/order-history'
								className='flex items-center'
							>
								{" "}
								<i className='material-icons mr-2 text-xl'>shopping_basket</i> Đơn
								Hàng
							</Link>
						</li>
						<li className='p-4 border-solid border-b border-gray-8 tracking-wider font-medium'>
							<Link
								to='/user/account/wishlist'
								className='flex items-center'
							>
								{" "}
								<i className='material-icons mr-2 text-xl'>favorite</i> Yêu Thích
							</Link>
						</li>
						<li className='p-4 border-solid border-gray-8  tracking-wider font-medium'>
							<Link
								to='/user/account/payment'
								className='flex items-center'
							>
								{" "}
								<i className='material-icons mr-2 text-xl'>payment</i> Thanh Toán
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<Switch>
						<Route path="/user/account/profile" component={Profile} exact />
						<Route path="/user/account/wishlist" component={Wishlist} exact />
						<Route path="/user/account/address" component={Address} exact />
						<Route path="/user/account/order-history" component={OrderHistory} exact />
						<Route path="/user/account/order/:id" component={OrderDetails} exact />
					</Switch>
				</div>
			</div>
		</div>
	)
}

export default Account

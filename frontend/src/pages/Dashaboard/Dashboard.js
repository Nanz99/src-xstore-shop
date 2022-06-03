
import { Switch, Route, Link } from 'react-router-dom'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Meta from 'components/Meta/Meta'
import React from 'react'
import ProductList from './ProductList/ProductList'
import ProductAdd from './ProductAdd/ProductAdd'

function Dashboard() {
	return (
		<div>
			<Meta title="Dashboard" />
			<Breadcrumb title="Dashboard" />
			<div className="px-24 py-10 grid grid-cols-2-20-80 gap-x-10">
				<div>
					<ul className="border border-solid border-gray-8">
						<li className='p-4 border-solid border-b border-gray-8 tracking-wider font-medium'>
							<Link
								to='/dashboard/productlist'
								className='flex items-center'
							>
								<i className="material-icons mr-2 text-xl">local_parking</i> Sản Phẩm
							</Link>
						</li>
						<li className='p-4  border-solid border-b border-gray-8 tracking-wider font-medium'>
							<Link
								to='/dashboard/customer'
								className='flex items-center'
							>
								{" "}
								<i className='material-icons mr-2 text-xl'>person</i> Khách Hàng
							</Link>
						</li>

					</ul>
				</div>
				<div>
					<Switch>
						<Route path="/dashboard/productlist" component={ProductList} />
						<Route path="/dashboard/add" component={ProductAdd} />
					</Switch>
				</div>
			</div>
		</div>
	)
}

export default Dashboard

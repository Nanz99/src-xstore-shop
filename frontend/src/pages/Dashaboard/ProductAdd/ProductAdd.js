import { createProduct } from 'actions/productActions'
import Meta from 'components/Meta/Meta'
import { PRODUCT_CREATE_RESET } from 'constants/productConstants'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import { toast } from "react-toastify"

function ProductAdd() {

	const [name, setName] = useState('')
	const [category, setCategory] = useState('')
	const [images, setImages] = useState([])
	const [imagesPreview, setImagesPreview] = useState([])
	// const [color, setColor] = useState([])
	// const [size, setSize] = useState([])
	const [countInStock, setCountInStock] = useState(0)
	const [price, setPrice] = useState(0)
	const [description, setDescription] = useState("")

	const dispatch = useDispatch()
	const { error, success } = useSelector(state => state.productCreate)

	useEffect(() => {
		if (error) {
			toast.error(error)
		}
		if (success) {
			toast.success("Đã Thêm Sản Phẩm")
			dispatch({ type: PRODUCT_CREATE_RESET })
		}
	})
	const submitHandler = (e) => {
		e.preventDefault()
		const formData = new FormData();
		formData.set('name', name);
		formData.set('price', price);
		formData.set('description', description);
		formData.set('category', category);
		formData.set('countInStock', countInStock);
		images.forEach(image => {
			formData.append('images', image)
		})
		dispatch(createProduct(formData));
		
	}
	const onChange = e => {

		const files = Array.from(e.target.files)

		setImagesPreview([]);
		setImages([])

		files.forEach(file => {
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.readyState === 2) {
					setImagesPreview(oldArray => [...oldArray, reader.result])
					setImages(oldArray => [...oldArray, reader.result])
				}
			}
			reader.readAsDataURL(file)
		})
	}
	return (
		<div>
			<Meta title="Thêm Sản Phẩm"/>
			<div className="">
				<h2 className="text-2xl font-semibold tracking-wide mx-3 mb-5">Thêm Sản Phẩm</h2>
			</div>
				<form action='' onSubmit={submitHandler}>
						<div className="flex item-center">
							<div className="mb-5 mx-3">
								<label htmlFor='name'>Tên </label>
								<input
									type='text'
									className='form-input-gr'
									id="name"
									value={name}
									placeholder=''
									onChange={(e) => setName(e.target.value)}
								/>

							</div>
							<div className='mb-5 mx-3'>
								<label className='block text-left'>
									<p className='text-gray-700'>
										Loại
									</p>
									<select
										className='form-input-gr'

										onClick={(e) => setCategory(e.target.value)}
									>
										<option value='Áo Thun'>Áo Thun</option>
										<option value='Áo Khoác'>Áo Khoác</option>
										<option value='Áo Hoodie'>Áo Hoodie</option>
										<option value='Quần Tây'>Quần Tây</option>
										<option value='Quần Short'>Quần Short</option>
										<option value='Quần Jogger'>Quần Jogger</option>
										<option value='Quần Jeans'>Quần Jeans</option>
										<option value='Giày dép'>Giày dép</option>
										<option value='Balo - Túi xách'>Balo - Túi xách</option>
										<option value='Phụ kiện khác'>Phụ kiện khác</option>
									</select>
								</label>
							</div>
						</div>
						{/* <div>
							<div>
								<label htmlFor='color'>Màu Sắc</label>
								<input
									type='text'
									className='form-input-gr'
									id="color"
									placeholder=''
									onChange={(e) => setImages(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor='size'>Kích cỡ</label>
								<input
									type='text'
									className='form-input-gr'
									id="color"
									placeholder=''
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</div>  */}
						<div className="flex items-center">
							<div className='mb-5 mx-3'>
								<label htmlFor="price">Giá</label>
								<input
									type='number'
									className='form-input-gr'
									id="name"
									value={price}
									placeholder=''
									onChange={(e) => setPrice(e.target.value)}
								/>
							</div>
							<div className='mb-5 mx-3'>
								<label htmlFor="countInStock">Tồn Kho</label>
								<input
									type='number'
									className='form-input-gr'
									id="name"
									value={countInStock}
									placeholder=''
									onChange={(e) => setCountInStock(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex items-center">
							<div className='mb-5 mx-3'>
								<label>Images</label>

								<div className='form-input-gr'>
									<input
										type='file'
										name='product_images'
										className='opacity-0 h-1 w-1 '
										id='customFile'
										onChange={onChange}
										multiple
									/>
									<label className='px-3 py-1 border border-solid border-gray' htmlFor='customFile'>
										Chọn Ảnh
									</label>
								</div>

							</div>
							<div className="flex items-center mb-5 mx-3">

								{imagesPreview.map(img => (

									<img src={img} key={img} alt="Images Preview" className="mt-3 mr-2 border border-solid border-gray w-12 h-12 block overflow-hidden" w />

								))}
							</div>
						</div>
						<div className="mb-5 mx-3">
							<label htmlFor="description_field">Description</label>
							<textarea className="block w-3/4 border mt-2 text-15 border-solid border-black py-3 px-4 rounded-md focus:outline-none focus:border-red-1 focus:placeholder-transparent" id="description_field" rows="6" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
						</div>
						<div className="mb-5 mx-3">
							<button type="submit" className="btn-submit-form">Tạo Sản Phẩm</button>
						</div>
					</form>
		</div>
	)
}

export default ProductAdd

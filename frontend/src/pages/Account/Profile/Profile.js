import { detailsUser, updateProfileUser } from "actions/userActions"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "components/Loading/Loading"
import UploadPhoto from "components/UploadPhoto/UploadPhoto"
import "./Profile.css"
import { toast } from "react-toastify"
import dateFormat from "dateformat"
import { USER_UPDATE_PROFILE_RESET } from "constants/userConstants"

function Profile() {
	const dispatch = useDispatch()
	const { userInfo } = useSelector((state) => state.userSignin)
	const { user } = useSelector((state) => state.userDetails)
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = useSelector((state) => state.userUpdateProfile)

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [numberPhone, setNumberPhone] = useState("")
	const [birthday, setBirthday] = useState("")
	const [gender, setGender] = useState("")

	useEffect(() => {
		if (!user) {
			dispatch(detailsUser(userInfo._id))
		} else {
			setName(user.name)
			setEmail(user.email)
			setNumberPhone(user.numberPhone)
			setBirthday(user.birthday)
			setGender(user.gender)
		}
	}, [dispatch, user, userInfo._id])
	useEffect(() => {
		if (successUpdate) {
			toast.success("Cập nhật dữ liệu thành công.")
		} else {
			toast.error(errorUpdate)
		}
		dispatch({ type: USER_UPDATE_PROFILE_RESET })
	}, [dispatch, errorUpdate, successUpdate])
	const submitHandler = (e) => {
		e.preventDefault()
		if (name && email && numberPhone && birthday && gender) {
			dispatch(
				updateProfileUser({
					userId: user._id,
					name,
					email,
					numberPhone,
					birthday,
					gender,
				})
			)
		}
	}

	if (!user) return <Loading />
	return (
		<div className=''>
			{loadingUpdate && <Loading />}
			<form action='' onSubmit={submitHandler}>
				<div className='grid grid-cols-2 gap-x-10'>
					<div>
						<div className='mb-5 mx-3'>
							<label htmlFor='fullname'>Họ và Tên</label>
							<input
								className='form-input-gr'
								type='text'
								id='fullname'
								placeholder='Nhập Họ và Tên'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className='mb-5 mx-3'>
							<label htmlFor='numerPhone'>Số điện thoại</label>
							<input
								className='form-input-gr'
								type='text'
								id='numerPhone'
								placeholder='Nhập Số Điện Thoại'
								required
								value={numberPhone}
								onChange={(e) => setNumberPhone(e.target.value)}
							/>
						</div>
						<div className='mb-5 mx-3'>
							<label htmlFor='email'>Email</label>
							<input
								className='form-input-gr'
								type='text'
								id='email'
								placeholder='Nhập Email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className='mb-5 mx-3'>
							<label htmlFor='birthday'>Ngày Sinh</label>

							<input
								type='date'
								id='birthday'
								name='trip-start'
								className='form-input-gr'
								value={dateFormat(birthday, "yyyy-mm-dd")}
								onChange={(e) => setBirthday(e.target.value)}
							/>
						</div>
						<div className='mb-5 mx-3'>
							<label htmlFor='gender'>Giới Tính</label>
							<ul className='mb-5 flex items-center'>
								<li className='m-3'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio'
											name='gender'
											value={`${gender === 'Nam' ? 'checked' : 'Nam'}`}
											onChange={(e) => setGender(e.target.value)}
										/>
										<span className='ml-2 capitalize'>Nam</span>
									</label>
								</li>

								<li className='m-3'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio'
											name='gender'
											value='Nữ'
											onChange={(e) => setGender(e.target.value)}
										/>
										<span className='ml-2 capitalize flex items-center'>
											Nữ
										</span>
									</label>
								</li>
								<li className='m-3'>
									<label className='inline-flex items-center cursor-pointer'>
										<input
											type='radio'
											className='form-radio'
											name='gender'
											value='Khác'
											onChange={(e) => setGender(e.target.value)}
										/>
										<span className='ml-2 capitalize inline-block'>
											Khác
										</span>
									</label>
								</li>
							</ul>
						</div>
					</div>
					<div className='mt-20'>
						<UploadPhoto />
						<p className='mt-3'>Bạn có thể chọn ảnh JPG hoặc PNG. </p>
						<p className='mt-2'>Dụng lượng file tối đa 2 MB. </p>
					</div>
				</div>
				<div className='mx-3'>
					<button type='submit' className='btn-submit-form'>
						Lưu Thay Đổi
					</button>
				</div>
			</form>
		</div>
	)
}

export default Profile

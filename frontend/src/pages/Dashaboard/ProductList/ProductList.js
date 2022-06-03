import React, { useEffect } from 'react'
import { styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from 'actions/productActions';
import Loading from 'components/Loading/Loading';
import { formatPrice } from 'utils/helper';
import { toast } from 'react-toastify';
import { TablePagination } from '@mui/material';
import Meta from 'components/Meta/Meta';
import './ProductList.css'


const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: " #f4f5f7",
		color: "#111",
		border: theme.palette.common.gray - 1,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));


function ProductList(props) {
	const dispatch = useDispatch()
	const { loading, error, products } = useSelector(state => state.productList)

	useEffect(() => {
		dispatch(listProducts())
	}, [dispatch])

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(7);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	useEffect(() => {
		if (error) {
			toast.error(error)
		}
	}, [error]);
	const createProductHandler = () => {
		props.history.push('/dashboard/add')
	}

	return (
		<div>
			<Meta title="Danh Sách Sản Phẩm" />
			<div className="mb-10 w-full flex justify-end">
				<button className="btn-primary-gr flex items-center" onClick={createProductHandler}><i className="material-icons mr-2 text-xl">add_circle_outline</i>Thêm Sản Phẩm</button>
			</div>
			{
				loading ? <Loading /> : error ? '' : (
					<Paper>
						<TableContainer className="rounded-none" component={Paper}>
							<Table sx={{ with: 700 }} aria-label="customized table">
								<TableHead>
									<TableRow>
										<StyledTableCell align="center">Ảnh</StyledTableCell>
										<StyledTableCell align="center">Tên Sản Phẩm</StyledTableCell>
										<StyledTableCell align="center">Loại </StyledTableCell>
										<StyledTableCell align="center">Giá</StyledTableCell>
										<StyledTableCell align="center">Tồn Kho</StyledTableCell>
										<StyledTableCell align="center"></StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{products &&
										products
											.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
											.map((item, index) => {
												return (
													<StyledTableRow key={index}>
														<StyledTableCell align="center" className="bg-white">
															<img src={item.images && item.images[0].url} alt="" className="w-20 block border-1 border-gray-8 " />
														</StyledTableCell>
														<StyledTableCell align="center" className="bg-white">
															{item.name}
														</StyledTableCell>
														<StyledTableCell align="center" className="bg-white">
															{item.category}
														</StyledTableCell>
														<StyledTableCell align="center" className="bg-white">
															{formatPrice(item.price)}
														</StyledTableCell>
														<StyledTableCell align="center" className="bg-white">
															{item.countInStock}
														</StyledTableCell>

														<StyledTableCell align="center" className="bg-white" >
															<div className="flex align-center justify-center">
																<button type="button" className="mx-2 text-blue-500" onClick={() => props.history.push(`/product/${item._id}/edit`)}>
																	<i className="material-icons">edit</i>
																</button>
																<button
																	type="button"
																	className="mx-2 text-red-500"
																	onClick={() => {
																		toast.success("Đã Xóa Đơn Hàng .");
																	}}
																>
																	<i className="material-icons">delete</i>
																</button>
															</div>
														</StyledTableCell>
													</StyledTableRow>
												);
											})}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							rowsPerPageOptions={[7, 25, 100]}
							component="div"
							count={products.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Paper>
				)
			}
			
		</div>
	)
}

export default ProductList

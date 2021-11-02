/** @format */

import React from "react";
import Meta from "../../components/Meta/Meta";
import Breadcrumb from "./../../components/Breadcrumb/Breadcrumb";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../../utils/helper";
import { removeFromCart } from "../../actions/cartActions";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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

function Cart(props) {
  const dispatch = useDispatch();
  // const redirect = props.location.search
  //   ? props.location.search.split("=")[1]
  //   : "/";
  
  const { cartItems } = useSelector((state) => state.cart);
  

  
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.amount, 0);
  const shippingFee = totalPrice > 500000 ? 0 : 25000;
  const totalOrder = totalPrice + shippingFee;
  if (cartItems.length ===0) {
    return (
      <div
        className="
      h-72 w-full flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-8">
            Giỏ hàng của bạn trống
          </h2>
          <Link
            to="/san-pham"
            className="px-6 py-2 bg-transparent border-2 border-solid border-black hover:bg-red-1 hover:border-red-1 hover:text-white"
          >
            Tiếp Tục Mua Hàng
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Meta title="Giỏ Hàng" />
      <Breadcrumb title="Giỏ hàng" />
      <div className="px-28 pt-10 py-20">
        <div className="mb-7">
          <h2 className="text-center text-3xl font-semibold">
            Giỏ Hàng Của Bạn
          </h2>
          <p className="text-base text-center">
            Có {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>
        <TableContainer className="rounded-none" component={Paper}>
          <Table sx={{ with: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">Sản Phẩm</StyledTableCell>
                <StyledTableCell align="center">Giá</StyledTableCell>
                <StyledTableCell align="center">Số Lượng</StyledTableCell>
                <StyledTableCell align="center">Thành Tiền</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center" className="bg-white">
                      <img
                        src={item.image && item.image.url}
                        alt={item.name}
                        className="w-20 h-20 block m-auto"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="left" className="bg-white">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="flex items-center">
                          <span className="font-semibold text-xs mr-2">
                            Màu sắc :{" "}
                          </span>{" "}
                          <button
                            className="w-3 h-3 inline-block"
                            style={{ backgroundColor: item.mainColor }}
                          ></button>
                        </p>
                        <p>
                          <span className="font-semibold text-xs mr-2">
                            Kích cỡ :{" "}
                          </span>
                          {item.mainSize}
                        </p>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center" className="bg-white">
                      {formatPrice(item.price)}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="bg-white">
                      {item.amount}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="bg-white">
                      {formatPrice(Number(item.amount) * Number(item.price))}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="bg-white">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(removeFromCart(item.product));
                          toast.success("Đã Xóa Sản Phẩm");
                        }}
                      >
                        <i className="fa fa-trash-alt"></i>
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-right">
          <div className="my-8 p-9 w-80 border text-left border-black border-solid inline-block rounded">
            <div className="flex justify-between mb-3">
              <span className="font-semibold"> Tổng tiền : </span>{" "}
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold"> Phí ship : </span>
              <span>{formatPrice(shippingFee)}</span>{" "}
            </div>
            <div className="flex justify-between pt-6 mt-6 border-gray border-t border-solid">
              <span className="font-semibold"> Tổng Đơn Hàng : </span>
              <span>{formatPrice(totalOrder)}</span>{" "}
            </div>
          </div>
          <div>
            <button
              onClick={() =>
                props.history.push(`/payment`)
              }
              className="px-6 py-2 w-80 uppercase rounded-none bg-transparent border-2 border-solid border-black text-black hover:border-red-1 hover:bg-red-1 hover:text-white"
            >
              Tiến Hành Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

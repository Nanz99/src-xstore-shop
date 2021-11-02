/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../../actions/userActions";
import Meta from "../../components/Meta/Meta";
import {toast} from 'react-toastify'

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
	const dispatch = useDispatch();
	const { userInfo ,error} = useSelector(state => state.userRegister)
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không giống nhau. Mời nhập lại !!!");
    } else {
      dispatch(register(name, email, password));
    }
  };
  useEffect(() => {
    if (userInfo) {
      toast.success('Đăng ký thành công')
      props.history.push(redirect);
    }
    if(error) {
      toast.error(error)
    }
  }, [props.history,error, redirect, userInfo]);
  
  return (
    <div className="py-24 text-center w-96 m-auto">
      <Meta title="Đăng Ký"/>
      <form action="" onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-left mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Name"
            className="block p-3 rounded-none border border-solid w-full border-gray-2 focus:outline-none focus:border-red-400"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-left mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="block p-3 rounded-none border border-solid w-full border-gray-2 focus:outline-none focus:border-red-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-left mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            className="block p-3 rounded-none border border-solid w-full border-gray-2 focus:outline-none focus:border-red-400"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="confirmpassword" className="block text-left mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm password"
            id="confirmpassword"
            placeholder="Enter Password 2"
            className="block p-3 rounded-none border border-solid w-full border-gray-2 focus:outline-none focus:border-red-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label />
          <button
            className="text-black bg-transparent border-2 border-solid border-black px-6 py-2 rounded-none hover:bg-red-1 hover:border-red-1 hover:text-white"
            type="submit"
          >
            Đăng Ký
          </button>
        </div>
        <div>
          <label />
          <div>
            Bạn đã có tài khoản?
            <Link
              to={`/dang-nhap?redirect=${redirect}`}
              className="text-red-1 ml-2"
            >
              Đăng nhập{" "}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;

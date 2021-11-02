/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signin } from "../../actions/userActions";
import Meta from "../../components/Meta/Meta";

import { toast } from "react-toastify";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { userInfo, error } = useSelector((state) => state.userSignin);

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      toast.success("🦄 Đăng Nhập Thành Công!")
      props.history.push(redirect);
      
    }
    if(error) {
      toast.error(error)
    }
  }, [props.history,error, redirect, userInfo]);
  return (
    <div className="py-24 text-center w-96 m-auto">
      <Meta title="Đăng Nhập" />
      <form action="" onSubmit={submitHandler}>
        <div className="block mb-4">
          <label htmlFor="email" className="mb-2 text-left block">
            Email
          </label>
          <input
            type="email"
            required
            id="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            className="block p-3 rounded-none border border-solid w-full border-gray-2 focus:outline-none focus:border-red-400"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className=" mb-6 text-center">
          <label htmlFor="password" className="mb-2 text-left block">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            required
            className="block p-3 rounded-none border border-solid w-full border-gray-2 focus:outline-none focus:border-red-400"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className=" mb-6">
          <label />
          <button
            className="text-black bg-transparent border-2 border-solid border-black px-6 py-2 rounded-none hover:bg-red-1 hover:border-red-1 hover:text-white"
            type="submit"
          >
            Đăng nhập
          </button>
        </div>
        <div>
          <label />
          <div>
            Bạn chưa có tài khoản?
            <Link
              to={`/dang-ky?redirect=${redirect}`}
              className="text-red-1 ml-2"
            >
              Đăng kí
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

// import React from 'react';

import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";

const Register = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const axios = useAxiosSecure();
    const { user, registerUser, updateUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();


    const handleRegistration = (data) => {
        // const profileImage = data.photo[0];
        registerUser(data.email, data.password)
        .then(res => {
            const userProfile = {
                displayName: data.name,
            }
            updateUser(userProfile)
            .then(update_res => {
                const userInfo = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email
                }
                axios.post("/user", userInfo) 
                .then(post_res => {
                    if (res.data.insertedId) {
                        console.log("User in db");
                    } 
                })
            })
        })
    }
    

    return (
    <div className="justify-center items-center">
        <form onSubmit={handleSubmit(handleRegistration)} className="fieldset rounded-box w-xs p-4">
          {/* <legend className="fieldset-legend">Login</legend> */}
          <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
            <div className="collapse-title font-semibold">Please fill out the registration form</div>
            <div className="collapse-content text-sm">
                <label className="label">Name</label>
                <input {
                    ...register("name", { required: true })
                    } type="text" className="input" placeholder="Name" />
                {errors.name?.type == "required" && (
                        <p className='text-red-600 text-sm'>No Name Found...</p>
                )}
                <label className="label">Email</label>
                <input type="email" {
                    ...register("email", { required: true })
                    } type="email" className="input" placeholder="Email" />
                {errors.email?.type == "required" && (
                        <p className='text-red-600 text-sm'>No Email Found...</p>
                )}
                <label className="label">Password</label>
                <input {
                    ...register("password", { 
                        required: true, 
                        minLength: 6,
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
                    })
                } type="password" className="input" placeholder="Password" />
                {errors.password?.type === "required" && (
                        <p className="text-red-600 text-sm">Password required...</p>
                )}
                {errors.password?.type === "minLength" && (
                        <p className="text-red-600 text-sm">Password must be at least 6 characters...</p>
                )}
                {errors.password?.type === "pattern" && (
                        <p className="text-red-600 text-sm">
                            Password not strong enough (uppercase, lowercase, number, special character)...
                        </p>
                )}
                <button className="btn btn-neutral mt-4 w-full">Register</button>
            </div>
          </div>
          <hr />
          {/* <button className="btn btn-neutral mt-4 w-full">Login</button> */}
          <button className="btn bg-white text-black border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Register with Google
          </button>
          <button className="btn bg-black text-white border-black">
            <svg aria-label="X logo" width="16" height="12" viewBox="0 0 300 271" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"/></svg>
            Register with X
          </button>
          <label htmlFor="">Already have account? <span><Link state={location?.state} className='text-blue-600' to={"/login"}>Login</Link></span></label>
        </form>
    </div>
    );
};

export default Register;
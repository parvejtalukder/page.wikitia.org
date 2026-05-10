// import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import Swal from "sweetalert2";

const Register = () => {
  
  const { user , goWithGoogle} = useAuth();
  const go_to = useNavigate();

  if (user) {
    go_to("/");
  }

  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosSecure();
  const { registerUser, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

    const GoogleRegister = async (e) => {
        e.preventDefault();
      try {
        const resGoGoogle = await goWithGoogle();
        const user = resGoGoogle.user;
        if (user) {
          await Swal.fire({
            title: 'Registration Completed!',
            text: `Welcome, ${user.displayName || 'User'}!`,
            icon: 'success',
            confirmButtonText: 'Continue',
          });
          navigate('/');
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: error.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    };

  const handleRegistration = async (data) => {
    try {
      
      const result = await registerUser(data.email, data.password);
      const createdUser = result.user;
      
      await updateUser({
        displayName: data.name,
      });
      
      const userInfo = {
        uid: createdUser.uid,
        displayName: data.name,
        email: createdUser.email,
      };
      
      const postRes = await axios.post("/add_user", userInfo);

      if (postRes.data.insertedId || postRes.data.success) {
        await Swal.fire({
          title: "Registration Completed!",
          text: "Your account has been created successfully.",
          icon: "success",
        });

        navigate(location?.state || "/");
      } else {
        Swal.fire({
          title: "Registration Failed!",
          text: "User was created, but could not be saved to the database.",
          icon: "warning",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Registration Failed",
        text: err.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="justify-center items-center">
      <form
        onSubmit={handleSubmit(handleRegistration)}
        className="fieldset rounded-box w-xs p-4"
      >
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 border-base-300 border"
        >
          <div className="collapse-title font-semibold">
            Please fill out the registration form
          </div>

          <div className="collapse-content text-sm">
            <label className="label">Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="input"
              placeholder="Name"
            />
            {errors.name?.type === "required" && (
              <p className="text-red-600 text-sm">No Name Found...</p>
            )}
            <label className="label">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-600 text-sm">No Email Found...</p>
            )}
            <label className="label">Password</label>
            <input
              {...register("password", {
                required: true,
                minLength: 6,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
              })}
              type="password"
              className="input"
              placeholder="Password"
            />

            {errors.password?.type === "required" && (
              <p className="text-red-600 text-sm">Password required...</p>
            )}

            {errors.password?.type === "minLength" && (
              <p className="text-red-600 text-sm">
                Password must be at least 6 characters...
              </p>
            )}

            {errors.password?.type === "pattern" && (
              <p className="text-red-600 text-sm">
                Password not strong enough (uppercase, lowercase, number,
                special character)...
              </p>
            )}

            <button className="btn btn-neutral mt-4 w-full">Register</button>
          </div>
        </div>

        <hr />

        <button
          onClick={GoogleRegister}
          type="button"
          className="btn bg-white text-black border-[#e5e5e5]"
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Register with Google
        </button>
        <label>
          Already have an account?{" "}
          <span>
            <Link
              state={location?.state}
              className="text-blue-600"
              to="/login"
            >
              Login
            </Link>
          </span>
        </label>
      </form>
    </div>
  );
};

export default Register;
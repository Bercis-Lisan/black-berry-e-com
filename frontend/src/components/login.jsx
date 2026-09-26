import { signInWithEmailAndPassword } from "firebase/auth"
import auth from "../config/auth"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Nav from "./common/nav"
import Footer from "./common/footer"
import { ADMIN_UID } from "./adminRoute"

const API_BASE_URL = `process.env.${REACT_APP_API_URL}/api`

function Login(){

const[user,euser] = useState("")
const[pass,epass] = useState("")
const navigate = useNavigate()
const location = useLocation()
const returnTo = location.state?.from?.pathname || "/"


function handleuser(evt){
    euser(evt.target.value)

}

function handlepass(evt){
    epass(evt.target.value)
}


function handleclick(e){
e.preventDefault();


        signInWithEmailAndPassword(auth, user, pass)
            .then(function(cred){
              // Fire-and-forget: keep our MongoDB user record in sync
              axios.post(`${API_BASE_URL}/users/sync`, {
                uid: cred.user.uid,
                email: cred.user.email,
              }).catch(() => {});
                alert("Login successful.");
                navigate(cred.user.uid === ADMIN_UID ? "/admin" : returnTo, { replace: true })

            })
            .catch(function(){
                const message = "Invalid credentials. Enter a valid email and password.";

                alert(message);
            });
}



    return(
        <>
        <Nav />
        <main className="bg-[#000000] min-h-screen">
          <div className="min-h-[calc(100vh-45px)] flex items-center justify-center px-4 py-16 md:p-8">
            <div className="grid items-center gap-y-14 gap-x-16 max-w-5xl w-full lg:grid-cols-2">

              <div className="max-w-lg max-lg:mx-auto text-center lg:text-left">
                <span className="text-[14px] font-[600] text-[#f5f5f7] tracking-[-0.022em]">Black Berry</span>

                <h2 className="text-4xl font-[600] !leading-tight text-[#f5f5f7] mt-6 tracking-[-1px]">
                  Seamless Login for Exclusive Access
                </h2>
                <p className="text-base mt-6 text-[#86868b] leading-relaxed">
                  Immerse yourself in a hassle-free login journey with our intuitively
                  designed login form. Effortlessly access your account.
                </p>

                <div className="text-sm mt-10 text-[#f5f5f7]">
                  Don't have an account
                  <Link to="/signup" state={{ from: location.state?.from }} className="text-[#2997ff] font-[600] hover:underline ml-1">Register here</Link>
                </div>
              </div>

              <div className="bg-[#1d1d1f] border border-[#333336] rounded-[18px] px-6 py-8 max-w-lg mx-auto w-full md:px-10 md:py-10 lg:max-w-md">
                <h1 className="text-3xl mb-8 font-[600] text-[#f5f5f7]">Sign in</h1>
                <form className="space-y-6" onSubmit={handleclick}>
                  <div>
                    <label htmlFor="email"
                      className="mb-2 text-[#f5f5f7] font-[600] text-sm inline-block">Email</label>
                    <input onChange={handleuser} type="email" id="email" name="email" placeholder="you@blackberry.com" required
                      className="px-3 py-2.5 text-sm text-[#f5f5f7] rounded-[8px] bg-[#000000] w-full border border-[#333336] outline-none focus:border-[#0071e3] placeholder:text-[#6e6e73]" />
                  </div>

                  <div className="relative">
                    <label htmlFor="password"
                      className="mb-2 text-[#f5f5f7] font-[600] text-sm inline-block">Password</label>
                    <input type="password" onChange={handlepass} id="password" name="password" placeholder="••••••••" required
                      className="px-3 py-2.5 text-sm text-[#f5f5f7] rounded-[8px] bg-[#000000] w-full border border-[#333336] outline-none focus:border-[#0071e3] placeholder:text-[#6e6e73]" />
                  </div>

                  <div className="flex items-start flex-wrap gap-2">
                    <label className="flex items-center gap-2 text-[#86868b] text-sm">
                      <input id="remember" name="remember" type="checkbox" className="rounded border-[#333336] bg-[#000000] accent-[#0071e3]" />
                      Remember me
                    </label>

                    <a href="#"
                      className="ml-auto text-sm font-[600] text-[#2997ff] hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <button type="submit"
                    className="w-full py-3 px-3.5 text-sm rounded-[980px] font-[600] cursor-pointer tracking-wide text-white bg-[#0071e3] hover:opacity-90 transition-opacity">
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        </>
    )
}

export default Login

import { createUserWithEmailAndPassword } from "firebase/auth"
import auth from "../config/auth"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Nav from "./common/nav"
import Footer from "./common/footer"

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`



function Signup(){

const[user,euser] = useState("")
const[pass,epass] = useState("")
const[cpass,ecpass] = useState("")
const navigate = useNavigate()
const location = useLocation()



function handleuser(evt){
    euser(evt.target.value)

}

function handlepass(evt){
    epass(evt.target.value)
}

function handlepassc(evt){
    ecpass(evt.target.value)
}


function handleclick(evt) {
    evt.preventDefault();

    if (pass !== cpass) {
      alert("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, user, pass)
      .then((cred) =>{
         alert("user registered successfully")
         // Record this user in MongoDB so the admin dashboard can count new signups
         axios.post(`${API_BASE_URL}/users/sync`, {
           uid: cred.user.uid,
           email: cred.user.email,
         }).catch(() => {});
         navigate(location.state?.from?.pathname || "/")
      } )
      .catch((err) =>{
        alert(err)
      })

    }







    return(
        <>
        <Nav />
        <main className="bg-[#000000] min-h-screen flex items-center py-16 px-4 md:px-8">
   <div className="w-full max-w-3xl max-md:max-w-md mx-auto">
      <div
         className="grid gap-x-10 gap-y-12 w-full p-6 rounded-[18px] overflow-hidden bg-[#1d1d1f] border border-[#333336] md:grid-cols-2 sm:p-10">
         <div>
            <div className="mb-8">
               <span className="text-[14px] font-[600] text-[#f5f5f7] tracking-[-0.022em]">Black Berry</span>
               <h2 className="text-[#f5f5f7] text-2xl font-[600] mt-4">Instant Access</h2>
               <p className="text-sm mt-3 text-[#86868b] leading-relaxed">
                 Join Black Berry for exclusive access to new products, offers, and order tracking.
               </p>
            </div>
         </div>

         <div>
            <div className="mb-8">
               <h1 className="text-[#f5f5f7] text-2xl font-[600]">Create an account</h1>
            </div>
            <form className="space-y-6">
               <div>
                  <label htmlFor="email"
                     className="mb-2 text-[#f5f5f7] font-[600] text-sm inline-block">Email</label>
                  <input onChange={handleuser} type="email" id="email" name="email" placeholder="you@blackberry.com" required
                     className="px-3 py-2.5 text-sm text-[#f5f5f7] rounded-[8px] bg-[#000000] w-full border border-[#333336] outline-none focus:border-[#0071e3] placeholder:text-[#6e6e73]" />
               </div>
               <div>
                  <label htmlFor="password"
                     className="mb-2 text-[#f5f5f7] font-[600] text-sm inline-block">Password</label>
                  <input onChange={handlepass} type="password" id="password" name="password" placeholder="••••••••" required
                     className="px-3 py-2.5 text-sm text-[#f5f5f7] rounded-[8px] bg-[#000000] w-full border border-[#333336] outline-none focus:border-[#0071e3] placeholder:text-[#6e6e73]" />
               </div>
               <div>
                  <label htmlFor="confirm-password"
                     className="mb-2 text-[#f5f5f7] font-[600] text-sm inline-block">Confirm
                     password</label>
                  <input onChange={handlepassc} type="password" id="confirm-password" name="confirm-password" placeholder="••••••••" required
                     className="px-3 py-2.5 text-sm text-[#f5f5f7] rounded-[8px] bg-[#000000] w-full border border-[#333336] outline-none focus:border-[#0071e3] placeholder:text-[#6e6e73]" />
               </div>

               <div className="flex items-start flex-wrap gap-2">
                  <label className="flex items-center gap-2 text-[#86868b] text-sm">
                     <input id="tmc" name="tmc" type="checkbox" required className="rounded border-[#333336] bg-[#000000] accent-[#0071e3]" />
                     I accept the
                  </label>

                  <a href="#"
                     className="text-sm font-[600] text-[#2997ff] hover:underline">
                     Terms and Conditions
                  </a>
               </div>

               <button onClick={handleclick} type="submit"
                  className="w-full py-3 px-3.5 text-sm rounded-[980px] font-[600] cursor-pointer tracking-wide text-white bg-[#0071e3] hover:opacity-90 transition-opacity">
                  Create an account</button>
            </form>

            <div className="mt-6 text-[#f5f5f7] text-sm text-center">Already have an account?
               <Link to="/login" state={{ from: location.state?.from }} className="text-[#2997ff] hover:underline ml-1 font-[600]">Login here</Link>
            </div>
         </div>
      </div>
   </div>
</main>
        <Footer />
        </>
    )
}

export default Signup

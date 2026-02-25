    import { supabase } from "../supaBaseClient";
    import { useRef, useState } from "react";
    import "./auth.css";

    function AuthPage({ setLoading, setCurrentUser, setLoginPageActive ,setLandingPageActive}) {
        const [isSignup, setIfSignup] = useState(true);
        const emailref = useRef();
        const usernameref = useRef();
        const passref = useRef();
        const fullnameref = useRef();
        

        async function handleUser(){
            setLoading(true);
            if(isSignup){
                const {data,error}=await supabase.auth.signUp({
                    email:emailref.current.value,
                    password:passref.current.value,
                    options:{
                        data:{
                            full_name:fullnameref.current.value,
                            display_name: usernameref.current.value
                        }
                    }
                })
                if(!error){
                    return
                }
                if(error){
                    alert(error.message)
                    console.error(error.message)
                    window.location.reload()
                    return
                }
            }
            else{
                const{data,error}=await supabase.auth.signInWithPassword({
                    email:emailref.current.value,
                    password:passref.current.value
                })
                if(!error){
                    setLoading(false)
                    setCurrentUser(data.user)
                }
                
                if(error){
                    alert(error.message)
                    window.location.reload()
                    return
                }
            }
        }



    return (
        <div className="authContainer">
        <div className="authHeader">
            <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <p>{isSignup ? "Join Knowledge Auditor today" : "Log in to your dashboard"}</p>
            <button className="toggleBtn" onClick={()=>{setLandingPageActive(true); setLoginPageActive(false)}}>
                <i className="fa-solid fa-arrow-left"></i>
                Back to Landing Page
            </button>
        </div>

        <form className="authForm" onSubmit={(e)=>{e.preventDefault(); handleUser()}} >
            {isSignup && (
            <>
            <div className="inputGroup">
                <label htmlFor="full_name">Full name</label>
                <input type="text" id="full_name" ref={fullnameref} placeholder="johndoe" required/>
            </div>
            <div className="inputGroup">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" ref={usernameref} placeholder="johndoe2091" required/>
            </div>
            </>
            )}

            <div className="inputGroup">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" ref={emailref} placeholder="name@company.com" required/>
            </div>

            <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passref} placeholder="••••••••" required/>
            </div>

            <button type="submit" className="authSubmitBtn">
            {isSignup ? "Sign Up" : "Sign In"}
            </button>
        </form>

        <div className="authFooter">
            <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
            <button className="toggleBtn" onClick={() => setIfSignup(!isSignup)}>
            {isSignup ? "Log In" : "Create one"}
            </button>
        </div>
        </div>
    );
    }

    export default AuthPage;

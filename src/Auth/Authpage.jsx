    import { supabase } from "../supaBaseClient";
    import { useRef, useState } from "react";
    import "./auth.css";

    function AuthPage({ Loading, setCurrentUser }) {
        const [isSignup, setIfSignup] = useState(true);
        const emailref = useRef();
        const usernameref = useRef();
        const passref = useRef();
        

        async function handleUser(){
            Loading(true);
            if(isSignup){
                const {data,error}=await supabase.auth.signUp({
                    email:emailref.current.value,
                    password:passref.current.value,
                    options:{
                        data:{
                            display_name: usernameref.current.value
                        }
                    }
                })
                if(!error){
                 alert("User made confirm Email and login")
                }
                if(error){
                    alert(error.message)
                    console.error(error.message)
                    return
                }
            }
            else{
                const{data,error}=await supabase.auth.signInWithPassword({
                    email:emailref.current.value,
                    password:passref.current.value
                })
                if(!error){

                    Loading(false)
                    setCurrentUser(data.user)
                }
                
                if(error){
                    alert(error.message)
                    return
                }
            }
        }



    return (
        <div className="authContainer">
        <div className="authHeader">
            <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <p>{isSignup ? "Join Knowledge Auditor today" : "Log in to your dashboard"}</p>
        </div>

        <form className="authForm" onSubmit={(e)=>{e.preventDefault(); handleUser()}} >
            {isSignup && (
            <div className="inputGroup">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" ref={usernameref} placeholder="johndoe" />
            </div>
            )}

            <div className="inputGroup">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" ref={emailref} placeholder="name@company.com" />
            </div>

            <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passref} placeholder="••••••••" />
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
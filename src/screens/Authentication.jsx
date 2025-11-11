import React, { useState } from 'react'
import RegisterpageInput from '../reusableComponents/RegisterpageInput';
import HomepageButton from '../reusableComponents/HomepageButton';
import RegisterpageButton from '../reusableComponents/RegisterpageButton';
import axios from 'axios';

const Authentication = () => {
    const [state, setState] = useState("signin");
    const [signin, setSignin] = useState({
        email:"",
        password:"",
    });

    const [signup, setSignup] = useState({
        email:"",
        username:"",
        phone:"",
        password:"",
        confirmPassword:"",
    });

    const handleSignin = (e) =>{
      const {name, value} = e.target;
      setSignin({...signin,[name]:value});
    }
    
    const signinUser = async() =>{
        const response = await axios.post('http://localhost:8080/user/api/signin',signin);
        console.log(response.data);
    }
  return (
    <div className='w-screen h-screen transition-all duration-150 bg-white flex justify-center items-center text-black '>
      <div className='max-w-150 min-w-120 px-10 py-5 shadow-lg border flex flex-col gap-5 border-gray-200 rounded-2xl'>
        <h1 className='text-2xl font-bold text-center'>BLOGWRITE</h1>
        <ul className='w-full h-8 bg-gray-200 border border-gray-300 flex rounded-lg px-0.5 gap-0.5 py-0.5'>
            <li value={state} onClick={() => setState("signin")} className={`h-full text-center w-1/2 cursor-pointer ${state == 'signin'? 'bg-white border border-gray-300':''} rounded-lg font-medium`}>SignIn</li>
            <li value={state} onClick={() => setState("signup")} className={`h-full text-center w-1/2  cursor-pointer ${state == 'signup'? 'bg-white border border-gray-300':''} rounded-lg font-medium`}>SignUp</li>
        </ul>
        {
          state === "signin" ?
              <div className='w-full flex flex-col gap-3 py-5'>
              <RegisterpageInput title={`Email`} value={signin.email} name={'email'} onChange={handleSignin} placeholder={'example@gmail.com'}/>
              <RegisterpageInput title={`Password`} value={signin.password} name={'password'} onChange={handleSignin} placeholder={'Password'}/>
              <a href='/auth' className='text-end hover:border-b w-fit transition-all duration-200 border-blue-600 hover:text-blue-600'>Forget Password?</a>
                <div className='w-full' onClick={() => signinUser()}>
                    <RegisterpageButton title={'Sign In'}/>
                </div>
              </div>
              : 
              <div className='flex flex-col gap-2'>
                  <RegisterpageInput title={'Username'} placeholder={'Alice Border'}/>
                  <RegisterpageInput title={'Email'} placeholder={'example@gmail.com'}/>
                  <RegisterpageInput title={'Phone'} placeholder={'xxxxxxxxx'}/>
                  <RegisterpageInput title={'Password'} placeholder={'Password'}/>
                  <RegisterpageInput title={'Confirm Password'} placeholder={'Password'}/>
                  <br />
                  <RegisterpageButton title={'Sign Up'}/>
              </div>
        }
      </div>
    </div>
  )
}

export default Authentication

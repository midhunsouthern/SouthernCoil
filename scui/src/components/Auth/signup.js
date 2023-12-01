import React from 'react'
import './login.css';

export default function signup() {
  return (
    <div className='login-bg'>
      <div className='row'>
        <div className='col-12'>
        <div className="circles">
  <div className="circle1"></div>
  <div className="circle2"></div>
</div>
<form action="#" className="login_form">
  <h1>Signup</h1>
  <p>Welcome to SOUTHERN COIL - Happy Beginning !!</p>
  <input type="text" placeholder="First Name"/>
  <input type="text" placeholder="Last Name"/>
  <input type="date" placeholder="DOB"/>
  <input type="number" placeholder="Mobile Number"/>
  <input type="password" placeholder="Password"/>
  <button type="submit">Signup</button>
</form>
        </div>
      </div>
    </div>
  )
}

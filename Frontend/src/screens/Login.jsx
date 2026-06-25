import React,{ useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {

  const [credentials, setCredentials] = useState({email:"", password:""})
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    console.log(json);

  if (!json.success) {
   toast.error("Invalid Email or Password");
   return;
}
  localStorage.setItem("userEmail", credentials.email);
  localStorage.setItem("authToken", json.authToken);

  toast.success("Login Successful 🎉");

  setTimeout(() => {
    navigate("/");
  }, 1000); // 1 second baad redirect

  } catch (error) {
  console.log("Fetch Error:", error);
  toast.error("Something went wrong!");
}
};

  const onChange=(event)=>{
    setCredentials({...credentials,[event.target.name]:event.target.value})
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
           <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
           <input type="email" className="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange}/>
           <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
           </div>
           <div className="mb-3">
           <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
           <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={credentials.password} onChange={onChange}/>
           </div>
           <button type="submit" className="btn btn-primary">Submit</button>
           <Link to="/signup" className="m-3 btn btn-danger">Create User</Link>
        </form>
    </div>
  )
}

export default Login
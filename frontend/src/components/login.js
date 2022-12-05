import React from "react";
import { useState } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import RestaurantsList from "./restaurants-list";

const Login = (props) => {
    let navigate = useNavigate();
    // setting initial user state
    const initialUserState = {
        name: "",
        id: "",
    };

    // hook for user
    const [user, setUser] = useState(initialUserState);

    // handling input fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // getting the name (id or name) and setting it with the valuec
        //console.log(user);
        setUser({...user, [name]: value});
    };

    const login = () => {
        props.log(user);
        navigate('/restaurants');
    };

    return (
        <div className="submit-form">
            <div>
                <div className = "form-group">
                    <label htmlFor="user">UserName</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        value={user.name}
                        onChange={handleInputChange}
                        name="name"/>

                </div>

                <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input type="text"
                        className="form-control"
                        id="id"
                        required
                        value={user.id}
                        onChange={handleInputChange}
                        name="id" />
                </div>

                <button onClick={login} className="btn btn-success">
                    Login
                </button>
            </div>

        </div>
    );
}


export default Login;
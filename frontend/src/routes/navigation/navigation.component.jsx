import React from 'react';
import { NavLink } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import logo from "../../assets/logo.png";
import { useSelector } from 'react-redux';
import './navigation.component.css';

const Navigation = () => {
    const user = useSelector((state) => state.user);
    const {username} = user;
    // console.log(user_id);
    return (
        <>
            <div className="navigation-container">
                <img src={logo} alt="logo" className="logo"/>
                <div className="nav-links">
                    <NavLink to='/' className="active">HOME</NavLink>
                    <NavLink to='/about' className="active">ABOUT</NavLink>
                    {!username ? (
                        <NavLink to='/auth' className="active">SIGN IN</NavLink>
                    ) : (
                        <NavLink to='/auth' className="active">SIGN OUT</NavLink>
                    )}
                </div>
            </div>
            <Outlet />
        </>
    );
};

export default Navigation;

"use client"
import { GetToken, Logout } from "@/services/auth-service";
import Link from "next/link";
import { useRef } from "react";

const Header = () => {
    const token = GetToken()

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">VIBES</a>
            </div>
            <div className="flex gap-2 items-center px-4">
                {!token ? (
                    <>
                        <Link href="/register" className="btn btn-soft btn-primary">Sign Up</Link>
                        <Link href="/login" className="btn btn-soft">Sign In</Link>
                    </>
                ) : (
                    <>
                        <span>Kevin Hendrawan</span>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={-1}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                <li><a onClick={() => {
                                    Logout();
                                    window.location.reload(); 
                                }}>Logout</a></li>
                            </ul>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default Header;

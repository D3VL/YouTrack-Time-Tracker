

import React from 'react';
import { Link } from "react-router-dom";

function TopBar() {

    const [menuOpen, setMenuOpen] = React.useState(false);

    const [userInfo, setUserInfo] = React.useState(null);

    React.useEffect(() => {
        if (!window.yt) return;
        window.yt.getCurrentUser().then(setUserInfo);
    }, []);

    return (
        <>
            <nav className="bg-gray-600 dark:bg-gray-900 fixed w-full">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                    <span className="flex items-center">
                        <span className="self-center text-xl whitespace-nowrap text-white">
                            YouTrack Timer
                        </span>
                    </span>

                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white"></span>

                            <div className="flex items-center space-x-4 cursor-pointer relative" onClick={setMenuOpen.bind(null, !menuOpen)}>
                                {userInfo?.avatarUrl && (<img className="w-10 h-10 rounded-full" src={window.yt.baseUrl.replace('/api', '') + userInfo?.avatarUrl} alt="" />)}
                                {!userInfo?.avatarUrl && (<div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                </div>)}

                                {userInfo?.online && (<span className="absolute top-9 left-3 transform -translate-y-1/2 w-3.5 h-3.5 bg-green-400 border-2 border-gray-600 dark:border-gray-800 rounded-full"></span>)}
                                {!userInfo?.online && (<span className="absolute top-9 left-3 transform -translate-y-1/2 w-3.5 h-3.5 bg-gray-400 border-2 border-gray-600 dark:border-gray-800 rounded-full"></span>)}
                            </div>

                            <div className={menuOpen ? '' : 'hidden'}>
                                <div className="z-10 absolute right-3 top-16 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ">

                                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        <div className="font-medium dark:text-white">{userInfo?.fullName || 'YouTrack User'}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{userInfo?.email || 'email@email.com'}</div>
                                    </div>

                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                                        <li>
                                            <Link onClick={setMenuOpen.bind(null, !menuOpen)} to="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Home</Link>
                                        </li>
                                        <li>
                                            <a onClick={setMenuOpen.bind(null, !menuOpen)} href={window.yt.userUrl + `/timesheets?author=me`} target="_blank" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My Timesheet</a>
                                        </li>
                                        <li>
                                            <a onClick={setMenuOpen.bind(null, !menuOpen)} href={window.yt.userUrl} target="_blank" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Open YouTrack</a>
                                        </li>
                                        <li>
                                            <Link onClick={setMenuOpen.bind(null, !menuOpen)} to="/configure" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</Link>
                                        </li>
                                    </ul>

                                    <div className="py-1">
                                        <a onClick={() => {
                                            setMenuOpen.bind(null, !menuOpen);
                                            window.storage.clear();
                                            window.location = window.location.origin + '/index.html'
                                        }} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                                    </div>

                                    <div className="py-1">
                                        <a href="https://d3vl.com/" target="_blank" className="font-bod block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Visit <span style={{ color: '#ff3e3e' }}>D3VL</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </nav>
            <div className="h-20"></div>
        </>
    )
}

export default TopBar
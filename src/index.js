import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom";
import YouTrackAPI from './YouTrackAPI'
import Store from './Store'

import './index.css';

// pages import
import Configure from './pages/Configure';
import Home from './pages/Home';

import SelectProject from './pages/AddNew/select-project';
import SelectIssue from './pages/AddNew/select-issue';
import CreateIssue from './pages/AddNew/create-issue';
import CreateTimer from './pages/AddNew/create-timer';

// components import
import TopBar from './components/TopBar';

(async () => {

    const root = ReactDOM.createRoot(document.getElementById('root'));

    try {
        window.storage = Store.getInstance()

        const { isConfigured, baseUrl, token, userUrl } = await window.storage.load();

        if (!isConfigured) return root.render(<Configure />);

        window.yt = new YouTrackAPI({ baseUrl, token, userUrl })
    } catch (e) {
        alert("There was a fatal error while loading the extension. Your configuration has been reset. Please reconfigure the extension.")
        await window.storage.clear()
    }


    root.render(
        <HashRouter>
            <TopBar />
            <Routes>
                <Route path="*" element={<Home />}></Route>

                <Route path="/add-new" element={<SelectProject />}></Route>
                <Route path="/add-new/:project" element={<SelectIssue />}></Route>
                <Route path="/add-new/:project/new-issue" element={<CreateIssue />}></Route>
                <Route path="/add-new/:project/:issue" element={<CreateTimer />}></Route>


                <Route path="/configure" element={<Configure />}></Route>
            </Routes>

            <div className="py-1 h-8">
                <a href="https://d3vl.com/" target="_blank" className="block px-4 py-2 text-sm text-gray-300 dark:text-gray-200 text-center fixed bottom-0 w-full bg-gray-600 dark:bg-gray-800">
                    <span className="font-bold" style={{ color: '#ff3e3e' }}>D3VL</span> - Software That Rocks
                </a>
            </div>
        </HashRouter>
    );
})();
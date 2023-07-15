import React from 'react';
import { Link } from "react-router-dom";


function AddNewButton() {

    return (
        <>
            <Link to="/add-new">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> Add New </button>
            </Link>
        </>
    );
}

export default AddNewButton;

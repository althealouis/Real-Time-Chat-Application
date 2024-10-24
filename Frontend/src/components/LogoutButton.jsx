import React from "react";

function LogoutButton({onLogout}) {
    return(
        <button
            onClick={onLogout}
            className="text-sm bg-blue-100 py-1 px-2 text-slate-900 border rounded-lg">
            LOGOUT
        </button>
    )
}

export default LogoutButton
import React, { useState } from "react";

function Input() {
    const [newMessageText, setNewMessageText] = useState('');

    function sendMessage(e) {
        e.preventDefault();
    }

    return (
        <form className=" flex" onSubmit={sendMessage}>
            <input
            value={newMessageText}
            type="text"
            placeholder="Type your message here"
            onChange={e => setNewMessageText(e.target.value)}
            className="flex-grow mr-2 rounded-full shadow-md border-white text-slate-900 p-2 font-medium hover:border-sky-400"
            />
            <button
                type="Submit"
                className="bg-sky-500 shadow-md hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-full"
            >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
            </button>
        </form>
    );
}

export default Input;

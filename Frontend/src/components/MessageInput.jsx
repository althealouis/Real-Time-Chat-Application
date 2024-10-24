import React from "react";

function MessageInput({newMessageText, setNewMessageText}) {

    return (
        <input
            value={newMessageText}
            type="text"
            placeholder="Type your message here"
            onChange={(e) => setNewMessageText(e.target.value)}
            className="flex-grow mr-2 rounded-xl shadow-md border-white text-slate-900 p-3 font-medium hover:border-gray-600"
        />
    );
}

export default MessageInput;

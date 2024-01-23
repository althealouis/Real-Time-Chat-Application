import React from "react";
import Avatar from "./Avatar";

function Contacts({id,username, onClick, selected, online}) {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        "border-b border-t flex flex-grow border-gray-500 cursor-pointer " +
        (selected ? " bg-gray-700 shadow-xl" : "")
      }
    >
      {selected && (
        <div className=" w-1.5 h-15 bg-slate-200 rounded-r-xl opacity-30 "></div>
      )}
      <div className="flex items-center gap-2 py-4 pl-4">
        <Avatar
          userName={username[id]}
          online={online}
        />
        <span
          className={
            "text-gray-900 font-semibold " +
            (selected ? "text-white" : "")
          }
        >
          {username[id]}
        </span>
      </div>
    </div>
  );
}

export default Contacts;

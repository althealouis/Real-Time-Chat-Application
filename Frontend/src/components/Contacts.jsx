import React from "react";
import Avatar from "./Avatar";

function Contacts({id,username, onClick, selected, online}) {
  return (
    <div className=" mt-6">
      {/* looping through all the online users */}
      {Object.keys(onlineUsersExcludingLoggedInUser).map((userId) => (
        <div key={userId} onClick={() => setSelectedUserId(userId)} className={"border-b border-t flex flex-grow border-gray-500 cursor-pointer " + 
        (userId === selectedUserId ? " bg-gray-700 shadow-xl" : "") }>
          {/* this is for the bar */}
          {userId === selectedUserId && (
            <div className=" w-1.5 h-15 bg-slate-200 rounded-r-xl opacity-30 "></div>
          )}
          {/* this is for the profile pic or Avatar */}
          <div className="flex items-center gap-2 py-4 pl-4">
            <Avatar
              userName={onlineUsersExcludingLoggedInUser[userId]}
              online={true}
            />
            {/* this is for displaying the name */}
            <span className={"text-gray-900 font-semibold " + (userId === selectedUserId ? "text-white" : "")}>
              {onlineUsersExcludingLoggedInUser[userId]}
            </span>
          </div>
        </div>
      ))}
      {/* looping through all the offline users */}
      {Object.keys(offlineUser).map((userId) => (
        <div key={userId} onClick={() => setSelectedUserId(userId)} className={"border-b border-t flex flex-grow border-gray-500 cursor-pointer " + 
        (userId === selectedUserId ? " bg-gray-700 shadow-xl" : "") }>
          {userId === selectedUserId && (
            <div className=" w-1.5 h-15 bg-slate-200 rounded-r-xl opacity-30 "></div>
          )}
          <div className="flex items-center gap-2 py-4 pl-4">
            <Avatar
              userName={offlineUser[userId].username}
              online={false}
            />
            <span
              className={
                "text-gray-900 font-semibold " +
                (userId === selectedUserId ? "text-white" : "")
              }
              >
              {offlineUser[userId]?.username}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Contacts;

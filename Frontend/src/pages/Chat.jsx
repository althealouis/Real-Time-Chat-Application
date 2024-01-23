import React, { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Logo, Input, Contacts } from "../components";
import { UserContext } from "../components/UserContext";
import axios from "axios";

function Chat() {
  const [ws, setWs] = useState(null);
  const [onlineUser, setOnlineUser] = useState({});
  const [offlineUser, setOfflineUser] = useState({})
  const [selectedUserId, setSelectedUserId] = useState();
  const divUnderMessages = useRef();
  // const [onlineUsersExclLoggedInUsers, setOnlineUsersExclLoggedInUsers] = useState({});

  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const { username, id } = useContext(UserContext);
  // console.log(username);

  //? for connection
  function connectToWs () {
    const newWs = new WebSocket("ws://localhost:5000");
    setWs(newWs);
    newWs.addEventListener("message", handleMessage);
    newWs.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected..... Please wait while we reconnect.")
        connectToWs();
      }, 1000)
    })
  }

  useEffect(() => {
    connectToWs();
  }, []);
  

  function showOnlineUsers(usersArray) {
    const onlineUsers = {};
    usersArray.forEach(({ userId, username }) => {
      onlineUsers[userId] = username;
    });
    // console.log("Online User : ",onlineUsers)
    setOnlineUser(onlineUsers);
  }

  //* to handle the message received from the server
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("onlineUsers" in messageData) {
      showOnlineUsers(messageData.onlineUsers);
    } else if ('text' in messageData){
      console.log("Received message :: ",messageData);
      setMessages(prev => [...prev, {
        ...messageData
      }]);
    }
  }

  const onlineUsersExcludingLoggedInUser = { ...onlineUser };
  delete onlineUsersExcludingLoggedInUser[id];

  //? ---- Messaging part------

  function sendMessage(e) {
    try {
      e.preventDefault();
      ws.send(JSON.stringify({
        messageData: {
          text: newMessageText,
          author: username,
          receiver: selectedUserId
        }
      }))
      setNewMessageText('')
      setMessages(prev => [...prev, {
        text: newMessageText,
        sender: id,
        receiver: selectedUserId
      }])
      console.log("sending message....");
      // console.log("sent message :: ", {messages})
    } catch (error) {
      console.log("sendMessage ERROR :: ", error)
    }
  }

  const token = localStorage.getItem("token") || null;
  const config = {
    headers: { "Authorization": token },
  }

  async function fetchMessages () {
    const messages = await axios.get('http://localhost:5000/api/v2/messages/' + selectedUserId, config);
    setMessages(messages.data)
    // console.log(messages.data)
  }

  async function fetchUsers () {
    const response = await axios.get('http://localhost:5000/api/v1/users')
    // console.log(response.data)
    const allUsers = response.data;
    const offlineUsersArray = allUsers.filter(user => user._id !== id).filter(user => !Object.keys(onlineUser).includes(user._id));
    const offlineUsers = {};
    offlineUsersArray.forEach(user => {
      offlineUsers[user._id] = user
    })
    setOfflineUser(offlineUsers);
    // console.log(Object.values(offlineUser));
  }

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
    }
    fetchUsers();
  }, [selectedUserId, onlineUser])

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  }, [messages])

  return (
    <>
    {/* overall div */}
      <div className="flex h-screen">

        {/* left panel */}
        <div className="p-4  bg-slate-400 w-1/3">
          <Logo />
          {/* contacts display */}
          <div className=" mt-6">
            {/* looping through all the online users */}
            {Object.keys(onlineUsersExcludingLoggedInUser).map((userId) => (
            //   <Contacts 
            //     key={userId}
            //     id={userId}
            //     onClick={() => {setSelectedUserId[userId];console.log(userId)}}
            //     username={onlineUsersExcludingLoggedInUser[userId]}
            //     online={true}
            //     selected={userId === selectedUserId} />
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
              // <Contacts 
              //   key={userId}
              //   id={userId}
              //   onClick={() => setSelectedUserId[userId]}
              //   username={offlineUser[userId]?.username}
              //   online={false}
              //   selected={userId === selectedUserId} />
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
        </div>

        {/* right panel */}
        <div className="bg-slate-900 text-white flex flex-col w-2/3">
          <div className="flex-grow">
            {/* {!selectedUserId ? (
              <div className=" font-bold text-center text-gray-100 text-opacity-0 flex h-full items-center justify-center">
                No user selected
              </div>
            ) : (
              <div className="font-bold text-3xl bg-stone-500 text-gray-300 p-4 flex items-center justify-center ">
                {onlineUsersExcludingLoggedInUser[selectedUserId]}
              </div>
            )} */}
            {!!selectedUserId && (
              <div className=" relative h-full">
                <div 
                className="overflow-y-scroll  absolute inset-0 mt-2" 
                style={{ WebkitOverflowScrolling: 'touch' }} >
                  {messages.map((message, index) =>  (
                    // console.log("sent message", message)
                    <div key={index} className={"p-1 mx-3 " + (message.sender === id ? 'text-right' : 'text-left')}>
                      <div className="text-left bg-slate-700 inline-block max-w-96 p-3 m-3 rounded-2xl" >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={divUnderMessages}></div>
                </div>
              </div>
            )}
          </div>
          
          {selectedUserId && (
            <form className=" flex p-2 mb-2" onSubmit={sendMessage}>
              <input
                value={newMessageText}
                type="text"
                placeholder="Type your message here"
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-grow mr-2 rounded-full shadow-md border-white text-slate-900 p-3 font-medium hover:border-sky-400"
              />
              <button
                type="Submit"
                className="bg-sky-500 shadow-md hover:bg-sky-600 text-white font-semibold p-3 px-4 rounded-full"
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
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;

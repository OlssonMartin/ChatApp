import React, { useEffect, useState, useMemo } from "react";
import SideNav from '../components/SideNav'; 

function Chat() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState("");

  const [fakeChat, setFakeChat] = useState([
    { text: "Tja tja, hur mår du?", avatar: "https://i.pravatar.cc/100?img=14", username: "Johnny", userId: 2 },
    { text: "Hallå!! Svara då!!", avatar: "https://i.pravatar.cc/100?img=14", username: "Johnny", userId: 2 },
    { text: "Sover du eller?! 😴", avatar: "https://i.pravatar.cc/100?img=14", username: "Johnny", userId: 2 },
  ]);

  const apiFetch = (url, method = 'GET', body = null, tokenRequired = true) => {
    const headers = { "Content-Type": "application/json" };
    const token = sessionStorage.getItem("userToken");
    if (token && tokenRequired) headers.Authorization = `Bearer ${token}`;

    return fetch(url, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null
    }).then((response) => response.json());
  };

  const fetchMessages = () => {
    apiFetch("https://chatify-api.up.railway.app/messages")
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages", err));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedJwt.id);
      setUsername(decodedJwt.user);
      setAvatar(decodedJwt.avatar);
      fetchMessages();
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!sendMessage) return;

    apiFetch("https://chatify-api.up.railway.app/messages", 'POST', {
      userId,
      text: sendMessage,
      avatar,
    }).then(() => {
      setSendMessage("");
      fetchMessages();
    });
  };

  const handleDelete = (msgID) => {
    apiFetch(`https://chatify-api.up.railway.app/messages/${msgID}`, 'DELETE')
      .then(() => setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msgID)));
  };

  const combinedMessages = useMemo(() => [...fakeChat, ...messages], [fakeChat, messages]);

  return (
    <div className="container-fluid">
      <div className="row">
        {}
        <div className="col-2">
          <SideNav />
        </div>

        {}
        <div className="col-10">
          <div className="container mt-4">
            <h1 className="text-center">Welcome to Chatify, {username}</h1>
            {avatar && <img src={avatar} className="rounded-circle mx-auto d-block my-3" style={{ width: "100px" }} alt="avatar" />}
            <div className="card shadow-lg p-3">
              <ul className="list-group">
                {combinedMessages.map((message, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex align-items-center justify-content-${message.userId === userId ? 'end' : 'start'}`}
                  >
                    <div className={`d-flex align-items-center ${message.userId === userId ? 'flex-row-reverse' : ''}`}>
                      <img
                        src={message.avatar || avatar}
                        alt={message.username}
                        className="rounded-circle me-3"
                        style={{ width: "40px" }}
                      />
                      <span className={`message-bubble ${message.userId === userId ? 'bg-primary text-white' : 'bg-light'}`} style={{ borderRadius: '15px', padding: '10px' }}>
                        {message.text}
                      </span>
                    </div>
                    {messages.some((msg) => msg.id === message.id) && (
                      <button className="btn btn-danger btn-sm ms-3" onClick={() => handleDelete(message.id)}>Delete</button>
                    )}
                  </li>
                ))}
              </ul>
              <form onSubmit={handleSendMessage} className="mt-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write your message"
                    value={sendMessage}
                    onChange={(e) => setSendMessage(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
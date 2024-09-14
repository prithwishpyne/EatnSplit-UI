import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";
import FriendsList from "./FriendsList";
import FormAddFriend from "./FormAddFriend";
import FormSplitBill from "./FormSplitBill";
import NavBar from "./NavBar";
import Description from "./Description";

import * as utils from "../utils.js";

// const initialFriends = [
//   {
//     id: 118836,
//     name: "Clark",
//     image: "https://i.pravatar.cc/48?u=118836",
//     balance: -7,
//   },
//   {
//     id: 933372,
//     name: "Sarah",
//     image: "https://i.pravatar.cc/48?u=933372",
//     balance: 20,
//   },
//   {
//     id: 499476,
//     name: "Anthony",
//     image: "https://i.pravatar.cc/48?u=499476",
//     balance: 0,
//   },
// ];

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [home, setHome] = useState(true);

  const headers = { "Content-Type": "application/json" };

  async function UpdateData() {
    const res = await axios.get(
      `http://${utils.URL}:${utils.PORT}/v1/getAllUserDetails`
    );
    console.log(res);
    setFriends(res.data.message);
  }

  function addUser(friend) {
    console.log(friend);
    try {
      axios
        .post(`http://${utils.URL}:${utils.PORT}/v1/addUser`, friend, {
          headers: headers,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            UpdateData();
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  function updateBalance(id, balance) {
    try {
      axios
        .post(
          `http://${utils.URL}:${utils.PORT}/v1/editBalance/${id}`,
          { balance: balance },
          {
            headers: headers,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            UpdateData();
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => UpdateData, []);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    addUser(friend);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    updateBalance(selectedFriend.id, value);
    setSelectedFriend(null);
  }

  function handleContinue() {
    setHome(false);
  }

  return (
    <>
      <NavBar />
      {home ? (
        <Description onContinue={handleContinue} />
      ) : (
        <div className="box">
          <div className="app">
            <div className="sidebar">
              {friends.length < 1 && (
                <p style={{ fontSize: "24px", color: "red" }}>
                  <em>No friends to display. Add a friend to continue.</em>
                </p>
              )}
              <FriendsList
                friends={friends}
                selectedFriend={selectedFriend}
                onSelection={handleSelection}
              />

              {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

              <Button onClick={handleShowAddFriend}>
                {showAddFriend ? "Close" : "Add friend"}
              </Button>
            </div>

            {selectedFriend && (
              <FormSplitBill
                selectedFriend={selectedFriend}
                onSplitBill={handleSplitBill}
                key={selectedFriend.id}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

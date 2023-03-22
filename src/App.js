import React, { useCallback, useState, useEffect, useRef } from "react";
import './App.css';
import Pusher from 'pusher-js';
import axios from "axios"


function App() {
  const [currentUser, setCurrentUser] = useState({})
  const currentUserIDRef = useRef(null);
  const [userNickname, setNickname] = useState("")
  const [userImage, setUserImage] = useState("")
  const [page, setPage] = useState("login")
  const [channel, setChannel] = useState()
  const [mainChannelUsers, setMainChannelUsers] = useState([])


  // Pusher.logToConsole = true;

  useEffect(() => {
      if (channel){
        channel.bind('pusher:subscription_succeeded', members => {
          let currentUserID = members.me.id
          let currentUserTemp = {...members.me.info, id: currentUserID}
          setCurrentUser(currentUserTemp)
          currentUserIDRef.current = currentUserID;

          let usersTemp = []

          Object.keys(members.members).forEach(userID => {
            let userIDInt = parseInt(userID)
            if (userIDInt !== currentUserID){
              usersTemp.push(members.members[userIDInt])
            }
          })
          setMainChannelUsers(usersTemp)
        });

        channel.bind('newMember', function(data) {
          if (currentUserIDRef.current !== null){
            setMainChannelUsers(prevUsers => {
              let usersTemp = [...prevUsers]
              if (parseInt(data.data.id) !== parseInt(currentUserIDRef.current)){
                usersTemp.push(data.data)
              }
              return usersTemp
            })
          }
          else{
            console.log('Failure:', data);
          }
        });

        channel.bind('pusher:member_removed', (member) => {
          setMainChannelUsers(prevUsers => {
            let usersTemp = [...prevUsers]
            let newUsersTemp = usersTemp.filter(function(obj) {
              return parseInt(obj.id) !== parseInt(member.id);
            });
            return newUsersTemp
          })
        })
    }
  }, [channel])

  // const pusher = new Pusher(process.env.REACT_APP_key, {
  //   cluster: "us2",
  //   authEndpoint: "https://fareharborback.onrender.com/pusher/auth",
  // });

  const pusher = new Pusher(process.env.REACT_APP_key, {
    cluster: "us2",
    authEndpoint: "http://localhost:8080/pusher/auth",
  });

  window.addEventListener("beforeunload", () => {
    pusher.unsubscribeAll();
  });

  const login = async () => {
    const channel = pusher.subscribe('presence-FH1')
    setChannel(channel)
    setPage("userPage")
  }

  return (
    <div className="App">
      { page === "login" ?
          <div>
            <p>
              enter the booking area as a random user!
            </p>
            <br></br>
            <button onClick={() => {login()}}>
              Log me in!
            </button>
          </div>
          :
          <div>
            <div style={{display: "flex"}}>
              <img style={{height: 100, width: 100}} src={currentUser.imageLink}/>
            </div>
            <div style={{display: "flex"}} >
              <p>
                Welcome {currentUser.userName}!
              </p>
            </div>
            <div>
              <p>
                Current Users viewing this page: {mainChannelUsers?.length}!
              </p>
              <div style={{display: "flex", marginLeft: 40, marginRight: 40}} >
                { mainChannelUsers?.length > 2 ?
                  <div>
                    <div style={{display: "flex"}}>
                        {mainChannelUsers?.slice(0,2).map(userDict => {
                          return (
                            <div style={{margin: 10}}>
                              <img className = "hiddenText" style={{height: 200, width: 200}} src={userDict.imageLink}/>
                              <div className= 'change'>
                                <p>
                                  userName: {userDict.userName}
                                </p>
                                <p>
                                  nickname: {userDict.name}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    <div >
                        <p className= "hiddenDiv">
                          There are + {mainChannelUsers?.slice(2).length} members not shown (hover this text to view them)
                        </p>
                        <div className= "showList">
                          { mainChannelUsers?.slice(2).map(userDict => {
                            return (
                              <div style={{display: "flex", marginRight: 10}}>
                                <img className = "" style={{height: 60, width: 60, marginRight: 10}} src={userDict.imageLink}/>
                                <div>
                                  <p style={{fontSize: 12}}>
                                    userName: {userDict.userName}
                                  </p>
                                  <p style={{fontSize: 12}}>
                                    nickname: {userDict.name}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                          }
                        </div>
                    </div>
                  </div>
                  :
                  <div style={{display: "flex"}}>
                    {mainChannelUsers?.map(userDict => {
                      return (
                        <div>
                          <img className = "hiddenText" style={{height: 200, width: 200, marginRight: 10}} src={userDict.imageLink}/>
                          <div className= 'change'>
                            <p>
                              userName: {userDict.userName}
                            </p>
                            <p>
                              nickname: {userDict.name}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
          </div>
      }
    </div>

  );
}

export default App;

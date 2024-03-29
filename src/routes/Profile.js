import { authService, dbService } from "fbase";
import {useNavigate} from "react-router-dom";
import {useState, useEffect } from "react";


const Profile=({userObj, refreshUser})=> {

    const history=useNavigate();
    const [newDisplayName,setNewDisplayName]=useState(userObj.displayName);

    const onLogOutClick=()=>{        
        authService.signOut();
        history("/");
    };

    const onChange = (event) => {
        const {
          target: { value },
        } = event;
        setNewDisplayName(value);
      };
    
      const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({ displayName: newDisplayName });
            refreshUser();
           
          }
      };
    

    // const getMytweets=async ()=>{
    //     const tweets=await dbService
    //     .collection("tweets")
    //     .where("creatorId","==",userObj.uid)
    //     .orderBy("createdAt","asc")
    //     .get();

    //     console.log(tweets.docs.map((doc)=>doc.data()));
    // }
    // useEffect(()=>{
    //     getMytweets();
    // },[])

    return (
        <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
            <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} autoFocus  className="formInput"/>

            <input type="submit" value="Update Profile" className="formBtn"
                style={{
                    marginTop: 10,
                }}/>
        </form>
         <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
         Log Out
         </span>
        </div>
    );

};

export default Profile;
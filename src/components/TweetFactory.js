import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const TweetFactory = ({userObj})=>{
    const [tweet, setTweet]=useState("");
    const [attachment, setAttachment]=useState("")

    const onSubmit=async (event)=>{
        event.preventDefault();
        if (tweet === "") {
            return;
          }
      
        let attachmentUrl="";

        if(attachment !==""){
            const attachmentRef=storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response=await attachmentRef.putString(attachment,"data_url");
             attachmentUrl= await response.ref.getDownloadURL();
    
        }
       

        await dbService.collection("tweets").add({
            text:tweet,
            createdAt:Date.now(),
            creatorId:userObj.uid,
            attachmentUrl,
        });
        
        setTweet("");
        setAttachment("");

    
    };

    const onChange=(event)=>{
        event.preventDefault();
        const {
            target:{value},
        }=event;
        setTweet(value)
    }

    const onFileChange=(event)=>{
        //console.log(event.target.files)
        const {
            target:{files},
        }=event;
        const theFile=files[0];
        const reader=new FileReader();

        reader.onloadend=(finishedEvent)=>{
            //console.log(finishedEvent);
            const {
                currentTarget:{result},
            }=finishedEvent;
            setAttachment(result);
        };
        if (Boolean(theFile)) {
            reader.readAsDataURL(theFile);
          }

    }

    const onClearAttachment=()=>{
        setAttachment("");
    }


return (
    <form onSubmit={onSubmit} className="factoryForm">
    <div className="factoryInput__container">
    <input  className="factoryInput__input" value={tweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120}/>
    <input type="submit" value="Tweet"  className="factoryInput__arrow" />
    </div>
    <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
    </label>
    <input  id="attach-file" type="file" accept="image/*" onChange={onFileChange}   
        style={{
          opacity: 0,
        }}/>
    
    {attachment && ( 
    <div  className="factoryForm__attachment">
    <img src={attachment} style={{
              backgroundImage: attachment,
            }} /> 
     <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
     </div>
    </div>
    )}
  
    </form>
);

};

export default TweetFactory;
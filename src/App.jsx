import { useState ,useEffect, useRef } from "react";
import "./App.css";
import Pill from "./component/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setsuggestions] = useState([]);
  const [selectedUsers,setSelectedUsers]=useState([])

  const [selectedUserSet,setSelectedUserSet]=useState(new Set())
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef=useRef()
  // https://dummyjson.com/users/search?q=John

  
  useEffect(() => {
    const fetchUsers = () => {
      setActiveSuggestion(0);
      if (searchTerm.trim() === "") {
        setsuggestions([])
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setsuggestions(data))
        .catch((err) => {
          console.error(err);
        });
    }
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser=(user)=>{
    setSelectedUsers([...selectedUsers,user])
    setSelectedUserSet(new Set([...selectedUserSet,user.email]))
    setSearchTerm("")
    setsuggestions([])
    inputRef.current.focus()
    
  }
  const handleRemoveUser=(user)=>{
      const updatedUsers=selectedUsers.filter((selectedUser)=>selectedUser.id!==user.id);
      setSelectedUsers(updatedUsers)
      const updatedEmails=new Set(selectedUserSet)
      updatedEmails.delete(user.email)
      setSelectedUserSet(updatedEmails)
  }
  const handleKeyDown=(e)=>{
    console.log(e.key)
    if(e.key==="Backspace" && e.target.value==="" && selectedUsers.length>0){
      const lastUser=selectedUsers[selectedUsers.length-1]
      handleRemoveUser(lastUser)
      setsuggestions([])
    }else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) =>
        prevIndex < suggestions.users.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.users.length
    ) {
      handleSelectUser(suggestions.users[activeSuggestion]);
    }
  }
  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => {
            return <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          
        })}
        
        {/* input field with search suggestions */}
        <div>
          <input
            type="text"
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a User"
            onKeyDown={handleKeyDown} //remove selected user when user press backspace
          />
          {/* Search Suggestions */}
          <ul className="suggestions-list">
           
          {suggestions?.users?.map((user, index) => {
            console.log(index);
              return !selectedUserSet.has(user.email)? (
                <li key={user.email} className={index === activeSuggestion ? "active" : ""} onClick={()=>handleSelectUser(user)}>
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) :
              <>
              </>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

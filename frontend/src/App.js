import React, {useState, useEffect} from 'react';
import './App.scss';
import moment from 'moment';
import EditLogo from './edit.svg';
import DeleteLogo from './delete.svg';

import {
  fetchUsers,
  postUser,
  putUser,
  deleteUser,
  deleteUsers,
} from './utils';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [deleteMode, setDeleteMode] = useState(null);
  const timestamp = new Date();

  const [fetchErorr, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchUsersApi() {
      const { error, res } = await fetchUsers();

      if (error) {
        setFetchError(true);
        setUsers([]);
      } else {
        setFetchError(false);
        console.log('res: ', res);
        setUsers(res);
      }
    }

    fetchUsersApi();
  }, []);

  const handleAddUser = () => {
    const newUser = {id: 'add_new', user_name: '', email: '', data: moment(timestamp).format('L HH:mm:ss')};
    const userWithAddNewId = users.find(user => user.id === 'add_new');
    if (userWithAddNewId) return;

    setEditedUser(newUser);
    setUsers(users.concat(newUser));
  };

  const deleteUserConfirm = async (user_name) => {
    await deleteUser(user_name);
    const updatedUsers = Object.assign([], users);
    const filteredUsers = updatedUsers.filter(user => user.user_name !== user_name);
    setUsers(filteredUsers);
  };

  const deleteAll = async () => {
    await deleteUsers();
    setUsers([]);
  };

  //EDIT USER

  const handleEditUser = (user) => {
    setEditedUser(editedUser && user?.id === editedUser?.id ? null : user);
  };

  //DELETE TOGGLE

  const handleDeleteToggle = (user) => {
    setDeleteMode(deleteMode && user?.id === deleteMode?.id ? null : user);
  };

  const handleEditUserField = e => {
    const { name, value } = e.target;

    setEditedUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveUser = async () => {
    const updatedUsers = Object.assign([], users);

    if (editedUser.id === 'add_new') {
      const data = await postUser(editedUser);
      const index = users.findIndex(user => user.id === 'add_new');
      updatedUsers[index] = data;
    } else {
      const oldUserName = users.find(user => user.id === editedUser.id).user_name;
      const data = await putUser(oldUserName, editedUser);
      const index = users.findIndex(user => user.id === data.id);
      updatedUsers[index] = data;
      setEditedUser(null);
    }
    setUsers(updatedUsers);
  };

  const renderUsers = () => (
    <React.Fragment>
      {users.map((user) => {
        const { id, user_name, email, data } = user;
        const editMode = editedUser && editedUser.id === user.id;
        const deleteMod = deleteMode && deleteMode.id === user.id;

        const validate = () => {
          const { user_name } = editedUser;
          const { email } = editedUser;

          //user_name
          const isUserNameValid = user_name.trim().length > 0;
          // const isEmailValid = email.match(/\S+@\S+\.\S+/).trim().length > 0;

          const validateEmail = (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          };


          // const isValidEmail = email.match(/^\S+@\S+\.\S+$/);
          console.log(validateEmail(email), 'validateEmail');

          return !isUserNameValid || !validateEmail(email);
        };

        // const validateEmail = () => {
        //   const { email } = editedUser;
        //
        //   const isEmailValid = email.trim().length > 0;
        //
        //   return !isEmailValid;
        // };

        return (
          <div key={id} className="row">
            <div className="col">
              {editMode ? <input name="user_name" value={editedUser.user_name} onChange={handleEditUserField} /> : user_name}
            </div>
            <div className="col">
              {editMode ? <input name="email" value={editedUser.email} onChange={handleEditUserField} /> : email}
            </div>
            <div className="col">
              {data}
            </div>
            <div className="cols">
              <button className="edit-button" onClick={() => handleEditUser(user)}><img className="logo" src={EditLogo} /></button>
              <button className="delete-button"  onClick={() => handleDeleteToggle(user)}><img className="logo" src={DeleteLogo} /></button>
              {deleteMod ? <button className="confirm-button" onClick={() => deleteUserConfirm(user.user_name)}>Confirm</button> : null}
              {editMode ? <button className="save-button" onClick={saveUser} disabled={validate()} >Save</button> : null}
            </div>
          </div>
        )
      })}
    </React.Fragment>
  );

  return (
    <div>
      <div id="todo-list">
        <div className="header">
          <button onClick={handleAddUser} className="button">Add Row</button>
          <button onClick={deleteAll} className="button">Remove All</button>
        </div>
        <div className="table">
          <div className="row table-header">
            <div className="col name">Name</div>
            <div className="col email">Email</div>
            <div className="col data">Data</div>
          </div>
          {fetchErorr ? <div className="error">Failed to fetch</div> : renderUsers()}
        </div>
      </div>
    </div>
  );
};

export default App;
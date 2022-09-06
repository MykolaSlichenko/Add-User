import React from 'react';
import './App.scss';


const App = () => {
  const renderUsers = () => (
    <React.Fragment>
          <div className="row">
            <div className="col">
              <input name="user_name" placeholder="Name"/>
            </div>
            <div className="col">
              <input name="email" placeholder="Email" />
            </div>
            <div className="col">
              data
            </div>
            <div className="cols">
              <button className="edit-button">Edit</button>
              <button className="delete-button">Delete</button>
            </div>
          </div>
     </React.Fragment>
        );

  return (
    <div>
      <div id="todo-list">
        <div className="header">
          <button className="button">Add Row</button>
          <button className="button">Remove All</button>
        </div>
        <div className="table">
          <div className="row table-header">
            <div className="col name">Name</div>
            <div className="col email">Email</div>
            <div className="col data">Data</div>
          </div>
          {renderUsers()}
          </div>
        </div>
      </div>
  );
};

export default App;
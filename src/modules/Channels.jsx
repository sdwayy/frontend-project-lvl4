import React from 'react';

const Channels = () => (
  <div className="col-3 border-right">
    <div className="d-flex mb-2">
      <span>Channels</span>
      <button type="button" className="ml-auto p-0 btn btn-link">+</button>
    </div>
    <ul className="nav flex-column nav-pills nav-fill">
      <li className="nav-item">
        <button type="button" className="nav-link btn-block mb-2 text-left btn btn-primary">
          general
        </button>
      </li>
      <li className="nav-item">
        <button type="button" className="nav-link btn-block mb-2 text-left btn btn-light">
          random
        </button>
      </li>
    </ul>
  </div>
);

export default Channels;
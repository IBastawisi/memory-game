import React from 'react';

function Card({icon, flipped, onClick}) {
  return (
    <div className={"card" + (flipped ? " flipped" : "")} onClick={onClick}>
       {!flipped ? <i className="material-icons">{icon}</i>:''}
    </div>
  );
}

export default Card;

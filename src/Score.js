import React from 'react';

function Score({moves, matched, wrong}) {
  return (
    <section className="score-panel">
       <div className="moves">Moves: {moves}</div>
       <div className="moves">Wrong: {wrong}</div>
       <div className="moves">Matched: {matched}</div>
    </section>
  );
}

export default Score;

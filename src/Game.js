import React, { useEffect, useState } from "react";
import Card from "./Card";
import Score from "./Score";
import pass from './img/pass.gif'

const icons = ['alarm', 'work', 'cloud', 'headset', 'flight', 'computer', 'fastfood', 'explore'
  , 'accessible', 'android', 'build', 'delete', 'eco', 'favorite', 'home', 'https'
  , 'fingerprint', 'grade', 'pets', 'thumb_up', 'shopping_cart', 'verified_user', 'mic', 'radio'
  , 'notification_important', 'vpn_key', 'save', 'drafts', 'sd_storage', 'toys', 'palette', 'style'
  , 'local_see', 'local_taxi', 'local_shipping', 'public', 'emoji_objects', 'sports_esports', 'emoji_events', 'casino']

function shuffleArray(array) {
  return array.sort(() => .5 - Math.random());
}

function generateCards(count) {
  if (count % 2 !== 0)
    throw "Count must be even: 2, 4, 6, etc. but it is " + count;

  const cards = shuffleArray(icons)
    .slice(0, count / 2)
    .map((icon, index) => ({
      id: index,
      icon: icon,
      flipped: true,
      canFlip: true
    }))
    .flatMap((e, i) => [e, { ...e, id: count / 2 + i }]);

  return shuffleArray(cards);
}

export default function Game(props) {
  const totalCards = 16;

  const [cards, setCards] = useState(generateCards(totalCards));
  const [canFlip, setCanFlip] = useState(false);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);

  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [wrong, setWrong] = useState(0);



  function setCardflipped(cardID, flipped) {
    setCards(prev => prev.map(c => {
      if (c.id !== cardID)
        return c;
      return { ...c, flipped };
    }));
  }
  function setCardCanFlip(cardID, canFlip) {
    setCards(prev => prev.map(c => {
      if (c.id !== cardID)
        return c;
      return { ...c, canFlip };
    }));
  }

  // reveal cards
  useEffect(() => {
    let index = 0;
    for (const card of cards) {
      setTimeout(() => setCardflipped(card.id, false), index++ * 100);
    }
    setTimeout(() => {
      let index = 0;
      for (const card of cards) {
        setTimeout(() => setCardflipped(card.id, true), index++ * 100);
      }
      setTimeout(() => setCanFlip(true), cards.length * 100);
    }, 3000);
  }, []);


  function resetFirstAndSecondCards() {
    setFirstCard(null);
    setSecondCard(null);
  }

  function onSuccessGuess() {
    setMatched(matched + 1)
    setCardCanFlip(firstCard.id, false);
    setCardCanFlip(secondCard.id, false);
    setCardflipped(firstCard.id, false);
    setCardflipped(secondCard.id, false);
    resetFirstAndSecondCards();
  }
  function onFailureGuess() {
    setWrong(wrong + 1)

    const firstCardID = firstCard.id;
    const secondCardID = secondCard.id;

    setTimeout(() => {
      setCardflipped(firstCardID, true);
    }, 1000);
    setTimeout(() => {
      setCardflipped(secondCardID, true);
    }, 1200);

    resetFirstAndSecondCards();
  }

  useEffect(() => {
    if (!firstCard || !secondCard) return;
    (firstCard.icon === secondCard.icon) ? onSuccessGuess() : onFailureGuess();
  }, [firstCard, secondCard]);


  function onCardClick(card) {
    if (!canFlip)
      return;
    if (!card.canFlip)
      return;

    if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id))))
      return;

    setCardflipped(card.id, false);

    if (firstCard) { setSecondCard(card); setMoves(moves + 1) } else setFirstCard(card);

  }

  return <div className="container">
    <header>
      <h1>Matching Game</h1>
    </header>
    {matched == totalCards / 2 ?
      <div className="deck pass">
        <img src={pass} alt="pass"/>
        <h2>YOU DID IT!</h2>
        <Score moves={moves} matched={matched} wrong={wrong} />
        <button className="restart" onClick={props.startNewGame}>Restart</button>
      </div>
      : <>
        <Score moves={moves} matched={matched} wrong={wrong} />
        <div className="deck">
          {cards.map(card => <Card onClick={() => onCardClick(card)} key={card.id} {...card} />)}
        </div>
        <button className="restart" onClick={props.startNewGame}>Restart</button></>}
  </div>;
}
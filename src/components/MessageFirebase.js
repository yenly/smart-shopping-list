import React, { useState } from 'react';
import { fb } from '../lib/firebase';

const MessageFirebase = () => {
  const [message, setMessage] = useState('');
  const db = fb.firestore();

  const sendMessage = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    db.collection('messages')
      .add({
        message: message,
      })
      .then((docRef) => {
        console.log(`Message sent with ID: ${docRef.id}`);
      })
      .catch((error) => console.error(`Error adding message: ${error}`));
    setMessage('');
  };

  const onChangeMessage = (event) => {
    let msg = event.target.value;
    setMessage(msg);
  };

  return (
    <div>
      <h1>Firestore Messages</h1>
      <form onSubmit={sendMessage}>
        <label htmlFor="message">Message:</label>
        <input id="message" value={message} onChange={onChangeMessage} />
        <button>Send</button>
      </form>
    </div>
  );
};

export default MessageFirebase;

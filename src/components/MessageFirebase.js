import React, { useState, useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from '../components/Firebase';

const MessageFirebase = () => {
  const firebase = useContext(FirebaseContext);
  const db = firebase.firestore();
  const [message, setMessage] = useState('');
  const [value, loading, error] = useCollection(db.collection('messages'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
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
  let list;
  if (value) {
    list = value.docs.map((doc) => {
      return doc.data();
    });
  }
  return (
    <div>
      <h1>Firestore Messages</h1>
      <form onSubmit={sendMessage}>
        <label htmlFor="message">Message:</label>
        <input id="message" value={message} onChange={onChangeMessage} />
        <button>Send</button>
      </form>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Messages: Loading...</span>}
      {list && (
        <ul>
          {list.map((msg) => (
            <li key={msg.message}>{msg.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageFirebase;

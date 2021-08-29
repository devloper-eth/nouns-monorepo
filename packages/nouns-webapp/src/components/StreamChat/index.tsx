import React, { useCallback, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageInputSmall,
  MessageList,
  Window,
} from 'stream-chat-react';
import axios from 'axios';
import classes from './StreamChat.module.css';
import 'stream-chat-react/dist/css/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Form, Row } from 'react-bootstrap';

let chatClient: any;

const StreamChatClient = () => {
  const [channel, setChannel] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = 'noun';
    async function getToken() {
      try {
        // local placeholder
        const response = await axios.post('http://localhost:5000/join', {
          username: username,
        });
        const { token } = response.data;
        const apiKey = response.data.api_key;

        chatClient = new StreamChat(apiKey);

        await chatClient.setUser(
          {
            id: username,
            name: username,
          },
          token,
        );

        const channel = chatClient.channel('commerce', 'live-chat');
        await channel.watch();
        setChannel(channel);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    getToken();
  }, []);

  return (
    <div>
      {loading ? (
        <FakeChatContainer />
      ) : (
        <>
          <p>rendered</p>
          <Chat client={chatClient} theme="livestream dark">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader live />
                <MessageList />
                <MessageInput Input={MessageInputSmall} focus />
              </Window>
            </Channel>
          </Chat>
        </>
      )}
    </div>
  );
};

export default StreamChatClient;

const FakeChatContainer = () => {
  const messagesList = [
    'We love nouns!',
    'Nouns Forever!',
    'OMG THE BID!',
    'Go away whales',
    'Sharks only',
    'Where am I',
    'Is this thing on',
    'Hello',
    'We love nouns!',
    'Nouns Forever!',
    'OMG THE BID!',
    'Go away whales',
    'Sharks only',
    'Where am I',
    'Is this thing on',
    'Hello',
    'We love nouns!',
    'Nouns Forever!',
    'OMG THE BID!',
    'Go away whales',
    'Sharks only',
    'Where am I',
    'Is this thing on',
    'Hello',
    'We love nouns!',
    'Nouns Forever!',
    'OMG THE BID!',
    'Go away whales',
    'Sharks only',
    'Where am I',
    'Is this thing on',
    'Hello',
  ];

  return (
    <>
      <div className={classes.chatContainer}>
        <ul className={classes.bidCollection}>
          {messagesList.map((bid, index) => (
            <li key={index} className={classes.bidRow}>
              <div className={classes.bidItem}>
                <div className={classes.leftSectionWrapper}>
                  {/* <div className={classes.bidder}>
                  <div>{bid}</div>
                </div> */}
                  <div className={classes.linkSymbol}>
                    <a href="#" target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  </div>
                  {/* <div className={classes.bidDate}>{`${moment().format(
                        'MMM DD',
                      )} at ${moment().format('hh:mm a')}`}</div> */}
                </div>
                <div className={classes.rightSectionWrapper}>
                  <div className={classes.bidAmount}>{bid}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ position: 'absolute', bottom: '2px', right: '2px' }}>
        <Row>
          <Col xs={8}>
            <input className={classes.chatInputBox} type="text" placeholder="Send a message" />
          </Col>
          <Col style={{ textAlign: 'center', float: 'right', alignItems: 'end' }}>
            <button style={{ marginLeft: 'auto' }} className={classes.connectWalletButton}>
              Chat
            </button>
          </Col>
        </Row>
      </div>
    </>
  );
};
// const [chatClient] = useState(new StreamChat(apiKey)); // important to init chatClient only once, you can replace this with useMemo
// const [loading, setLoading] = useState(true); // used to render a loading UI until client successfully is connected

// const channel = chatClient.channel('nouns-chat', 'nounstuff_kXQTZKCqbF', {
//   name: "Nouns Chat",
//   members: ["noun-test-user"],
//   session: 8 // custom field, you can add as many as you want
// });

// useEffect(() => {

//   if (loading) chatClient.connectUser(user, token).then(() => setLoading(false)); // client connects(async) with provided user token
// }, []); // eslint-disable-line react-hooks/exhaustive-deps

// if (loading) return <div>Loading...</div>;

// const apiKey = 'rw9qedzums64';
// const user = { id: 'noun-test-user', name: 'Nounder' };
// // you can generate user token for development using your app secret via https://getstream.io/chat/docs/token_generator/
// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibm91bi10ZXN0LXVzZXIifQ.zpMtTivoBmtPlfdtEzoWDnJd6_LX5MMZ_b4kioY1rJs';

// const chatClient = StreamChat.getInstance('rw9qedzums64');

// chatClient.connectUser(user, token);

// await chatClient.createChannelType({
//   name: 'nouns-chat',
//   mutes: false,
//   reactions: false,
// });

// const channel = chatClient.channel('nouns-chat', 'spacex', {
//   name: 'Nouns',
// });

// const userToken =
//   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoid2l0aGVyZWQtYmFzZS03In0.0U-2GRx23bLnBodw9bEGeeG0-McCMjU-Vf65VPZdlLU';

// chatClient.connectUser(
//   {
//     id: 'withered-base-7',
//     name: 'withered-base-7',
//     image: 'https://getstream.io/random_png/?id=withered-base-7&name=withered-base-7',
//   },
//   userToken,
// );

// const channel = chatClient.channel('livestream', 'spacex', {
//   image: 'https://goo.gl/Zefkbx',
//   name: 'SpaceX launch discussion',
// });

// https://getstream.io/chat/react-chat/tutorial/

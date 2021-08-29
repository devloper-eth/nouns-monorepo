import classes from './Footer.module.css';
import Section from '../../layout/Section';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import VisitorSocialCursor from '../SocialCursor/VisitorSocialCursor';
import { useEffect, useRef, useState } from 'react';
import { emojis } from '../SocialCursorCollection';
import orangeGuy from '../../assets/miniNounOrangeJumpUp.gif';
import greenGuy from '../../assets/miniNounGreenJumpUp.gif';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.tokenAddress, Network.mainnet);

  const location = useLocation();
  const useGreyBg = useAppSelector(state => state.application.useGreyBackground);
  const bgColor = useGreyBg ? '#d5d7e1' : '#e1d7d5'; // location.pathname === '/' ? 'white' :

  return (
    <Section className={classes.footerContainer} bgColor={bgColor} fullWidth={true}>
      {/* <footer className={classes.footerSignature}>
        <a href={twitterURL} target="_blank" rel="noreferrer">
          twitter
        </a>
        <a href={etherscanURL.toString()} target="_blank" rel="noreferrer">
          etherscan
        </a>
        <a href={discordURL} target="_blank" rel="noreferrer">
          discord
        </a>
      </footer> */}
      <RandomGuys />

      <div className={classes.userIconsContainer}>
        {emojis.slice(0, 20).map((icon, index) => (
          <span
            className={classes.userIcons}
            style={{
              backgroundColor: randomColor(),
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              marginRight: `${index}0px`,
              textAlign: 'center',
            }}
          >
            {icon}
          </span>
        ))}
      </div>
      <div className={classes.cursorInstructions}>
        <p>
          Chat <code className={classes.codeText}>cmd + /</code>
        </p>
        <p>
          Escape <code className={classes.codeText}>esc</code>
        </p>
        <p>
          Hide Cursors <code className={classes.codeText}>cmd + x</code>
        </p>
      </div>
    </Section>
  );
};
export default Footer;

const randomColor = () => {
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return color;
};

const RandomGuys = () => {
  // These will be controlled by users with left/right arrows and spacebar for jump, locked to view width of container.

  return (
    <>
      <div style={{ position: 'fixed', bottom: '1px', right: '40%' }}>
        <img src={greenGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '1px', right: '50%' }}>
        <img src={orangeGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '10px', right: '30%' }}>
        <img src={greenGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '1px', right: '35%' }}>
        <img src={orangeGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '1px', right: '50%' }}>
        <img src={greenGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '5px', right: '70%' }}>
        <img src={orangeGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '1px', right: '50%' }}>
        <img src={greenGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '7px', right: '60%' }}>
        <img src={orangeGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '13px', right: '75%' }}>
        <img src={greenGuy}></img>
      </div>
      <div style={{ position: 'fixed', bottom: '4px', right: '43%' }}>
        <img src={orangeGuy}></img>
      </div>
    </>
  );
};

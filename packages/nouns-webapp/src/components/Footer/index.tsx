import classes from './Footer.module.css';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import Section from '../../layout/Section';

const Footer = () => {
  const discordURL = externalURL(ExternalURL.discord);

  const location = useLocation();
  const useGreyBg = useAppSelector(state => state.application.useGreyBackground);
  const bgColor =
    location.pathname === '/' || location.pathname.startsWith('/noun/')
      ? 'white'
      : useGreyBg
      ? '#d5d7e1'
      : '#e1d7d5';

  return (
    <>
      <div className={classes.cursorInstructions}>
        <p>
          Chat <code className={classes.codeText}>cmd + /</code>
        </p>
        <p>
          Escape <code className={classes.codeText}>esc</code>
        </p>
        {/* <p>
          Hide Cursors <code className={classes.codeText}>cmd + x</code>
        </p> */}
      </div>

      <Section bgColor={bgColor} fullWidth={false}>
        <footer className={classes.footerSignature}>
          <a href="https://twitter.com/devloper_eth" target="_blank" rel="noreferrer">
            twitter
          </a>
          <a href={discordURL} target="_blank" rel="noreferrer">
            discord
          </a>
        </footer>
      </Section>
    </>
  );
};
export default Footer;

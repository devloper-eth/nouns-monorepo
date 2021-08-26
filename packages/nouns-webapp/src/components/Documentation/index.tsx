import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Link from '../Link';

const Documentation = () => {
  const nounsLink = (
    <Link text="nouns.wtf" url="https://nouns.wtf" leavesPage={true} />
  );
  const noun13Link = (
    <Link text="@devloper_eth" url="https://twitter.com/devloper_eth" leavesPage={true} />
  );
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>WTF?</h1>
          <p>
            Nouns.party is a community hosted fork of {nounsLink} built to enable social experiences around the daily nouns auction. The underlying contracts are all the same, but we’ve layered on a fun social experience inspired by partybid.app.
          </p>
          <p>
            Use cmd+/ to start typing! Chase your friends around! And generally enjoy the action!
          </p>
          <p>
          There is much more to come for social nouns in the next few days! Stay tuned on twitter.
          </p>
          <p>
            Built with 🗑🔥 by Noun13 ({noun13Link})
          </p>
        </div>
      </Col>
    </Section>
  );
};
export default Documentation;

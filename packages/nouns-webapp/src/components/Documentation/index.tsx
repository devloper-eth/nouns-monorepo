import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Link from '../Link';

const Documentation = () => {
  const noun13Link = (
    <Link text="Noun13" url="https://twitter.com/devloper_eth" leavesPage={true} />
  );
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Social Nouns WTF?</h1>
          <p>
            {noun13Link}
          </p>
        </div>
      </Col>
    </Section>
  );
};
export default Documentation;

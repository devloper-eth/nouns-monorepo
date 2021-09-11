import Section from '../../layout/Section';
import { Col, Card } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';

const Documentation = () => {
  const nounsLink = (
    <Link text="Nouns.wtf" url="https://nouns.wtf" leavesPage={true} />
  );

  const fractionalizeLink = (
    <Link text="Fractional.app" url="https://fractionalize.app" leavesPage={true} />
  );

  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Party?</h1>
          <p>
            Nouns are an experimental attempt to improve the formation of on-chain avatar
            communities. Nouns party is an extension of the core ideas powering nouns, but with the community
            in mind. Now, with nouns party, anyone can contribute to a collective vault so that the community
            can win nouns together. 
          </p>

          <p>
            To learn more about the nouns project at large, head over to {nounsLink}.
          </p>
        </div>
        <Accordion>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="1" className={classes.cardHeader}>
              FAQ
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <h3>How can I add funds</h3>
                <p>
                  Simple click add funds and select the amount of ethereum that you'd like to contribute. The community
                  will collectively use these funds to bid on nouns auctions until an auction is won. If you 
                </p>
                <h3>How can I withdraw my funds</h3>
                <p>
                You can withdraw your funds at anytime outside of an active bid. An active
                bid occurs when the nouns party vault has more ethereum than the current largest
                bidder in the {nounsLink} auction. We only allow the party
                to submit their bid within the final hour of the auction. 
                </p>
                <h3>What happens when the vault wins an auction?</h3>
                <p>
                  lorem ipsum
                </p>
                <h3>What happens when the vault losses an auction?</h3>
                <p>
                  lorem ipsum
                </p>
                <h3>How does settlement work</h3>
                <p>
                  lorem ipsum
                </p>
                <h3>How do I get my shares?</h3>
                <p>
                  lorem ipsum
                </p>
                <h3>What about nouns DAO governance?</h3>
                <p>
                  lorem ipsum
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="3" className={classes.cardHeader}>
              Nouns party team rewards
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <p>
                  The nouns party team is a collective of 4 people that formed to help contribute to the nouns
                  ecosystem. We are an active member of the nouns DAO governance and own noun#13. 
                </p>
                <ul>
                  <li>@devloper_eth</li>
                  <li>@hansklaus4711</li>
                  <li>@0xfloyd</li>
                  <li>@bstsrvdbld</li>
                </ul>
                <p>
                  Because 100% of the vault funding will be contributed to the nounsdao auctions, the
                  nouns party team has chosen to be compensated in fractions of the nouns which are won by 
                  the nouns party vault. The team will only be compensated in nouns
                  shares and will only be compensated when an auction is won. 
                </p>

                <p>
                  The nouns DAO and the nouns party team have agreed to reward the team 2.5% of the noun
                  shares earned through auctions won on nouns party.
                </p>

                <p>
                  As a result, nouns party funders can expect 2.5% fewer tokens than their
                  initial vault contribution. For example, if a noun is won for 200E and is tokenized
                  into 200,000 tokens, the vault funders will receive 200,000 less 2.5%, or 195,000
                  tokens distributed in proportion to the amount each funder contributed to the vault. 
                </p>

                <p>
                  This 2.5% of noun shares is distributed to the nouns party multisig.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;

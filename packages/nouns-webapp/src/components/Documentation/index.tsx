import Section from '../../layout/Section';
import { Col, Card } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
// import { classicNameResolver } from 'typescript';

const Documentation = () => {
  const nounsLink = <Link text="Nouns.wtf" url="https://nouns.wtf" leavesPage={true} />;

  const fractionalizeLink = (
    <Link text="Fractional.art" url="https://fractionalize.art" leavesPage={true} />
  );
  const nounsProposal = (
    <Link text="nouns DAO proposal process" url="https://nouns.wtf/vote/3" leavesPage={true} />
  );

  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Party?</h1>
          <p>
            Nouns are an experimental attempt to improve the formation of on-chain avatar
            communities. Nouns party is an extension of the core ideas powering nouns, but with the
            community in mind. Now, with nouns party, anyone can contribute to a collective vault so
            that the community can win nouns together.
          </p>

          <p>To learn more about the nouns project at large, head over to&nbsp;{nounsLink}.</p>
        </div>
        <Accordion>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="1" className={classes.cardHeader}>
              <h2 className={classes.faq}>FAQ</h2>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <h3>How can I add funds?</h3>
                <p className={classes.documentationParagraph}>
                  Simple click add funds and select the amount of ethereum that you'd like to
                  contribute. The community will collectively use these funds to bid on nouns
                  auctions until an auction is won.
                </p>
                <h3>How can I withdraw my funds?</h3>
                <p className={classes.documentationParagraph}>
                  You can withdraw your funds at anytime outside of an active bid. An active
                  bid occurs when the nouns party vault has more ethereum than the current
                  largest bidder in the&nbsp;{nounsLink}&nbsp;auction and when the auction is less than
                  one hour from completing. If the party does not win the auction, you can
                  return and withdraw your funds. If the party wins, you can return and claim your shares!
                </p>
                <h3>What happens when the vault wins an auction?</h3>
                <p className={classes.documentationParagraph}>
                  When the vault has enough funds to win an auction, the community can use those funds
                  to bid on a noun auction. When the community wins, anyone will be able to settle the
                  auction. This causes the noun to be stored in a fractionalize vault and converted to
                  noun shares. These shares represent your proportional ownership of the noun. They can
                  be claimed at any time after settlement.
                </p>
                <h3>What happens when the vault losses an auction?</h3>
                <p className={classes.documentationParagraph}>
                  After an unsuccessful auction, the funds will remain in the party vault for the next
                  auction. Contributors can return and withdraw funds or add additional funds at any
                  time before the next auction to improve the chance of winning!
                </p>
                <h3>How does settlement work?</h3>
                <p className={classes.documentationParagraph}>
                  Once the party vault wins a noun, the community will be presented with the option to
                  settle. Settlement causes the noun to be transfered into a&nbsp;{fractionalizeLink}&nbsp;vault and
                  converted into ERC20 tokens which represent each contributors proportional ownership
                  of that noun. These tokens will be named in the style of, e.g. NOUN13.
                </p>
                <h3>How do I get my shares?</h3>
                <p className={classes.documentationParagraph}>
                  Once the party vault wins a noun and the auction is settled, you will be able to return
                  and claim your shares. All shares from anyone won auctions can be claimed in a single
                  action. The share ownership will be transferred to the cooresponding contributor via the
                  claim action.
                </p>
                <h3>What can I do with my shares?</h3>
                <p className={classes.documentationParagraph}>
                  The ERC20 tokens represent your proportional ownership in any nouns auctions which you've won.
                  These share can be used in several ways. They can be used to set a reserve price at which the
                  community will re-sell the noun through fractional, they can be used to provide liquidity to the
                  fractional vault or they can be exchanged for ethereum at the fractional exchange rate.

                  If you return after settlement of a successful auction, you will see a link on your
                  noun where you can perform these actions.

                  See the&nbsp;{fractionalizeLink}&nbsp;FAQ for further details.
                </p>
                <h3>What about nouns DAO governance?</h3>
                <p className={classes.documentationParagraph}>
                  Each noun also comes with a vote in nouns.wtf governance. Today this vote will be held by the&nbsp;{fractionalizeLink}&nbsp;
                  vault and the community will be unable to vote with it. However, the team
                  is in the process of creating a community governance module so the entire community of contributors
                  for each won noun can create a community around their noun and have voting power within
                  the nounsdao governance.

                  We expect to deliver a proof-of-concept of this form of community governance in the near future.
                </p>
                <h3>What's next for nouns party?</h3>
                <p className={classes.documentationParagraph}>
                  We want community nouns won through nouns party to become some of the most prolific members of
                  the nouns dao. With this initial launch, we aim to simplify community participation in nouns.
                  Over time we will build better tooling to help enable the formation of new DAOs and governance
                  around community-owned nouns. Watch this space.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="2" className={classes.cardHeader}>
              <h2 className={classes.teamRewards}>The team</h2>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <p className={classes.collectiveParagraph}>
                  The nouns party was founded by @devloper_eth and @hansklaus4711, two builders who
                  escaped the corporate world. Now they help contribute to the nouns ecosystem. They
                  are an active member of the nouns DAO governance and own noun#13.
                </p>
                <p className={classes.documentationParagraph}>
                  The team behind nouns party is a collective of four contributors. The team was initially
                  bootstrapped through the&nbsp;{nounsProposal}.
                </p>
                <ul className={classes.weAreTheBuildersBaby}>
                  <li>@devloper_eth</li>
                  <li>@hansklaus4711</li>
                  <li>@0xfloyd</li>
                  <li>@bstsrvdbld</li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="3" className={classes.cardHeader}>
              <h2 className={classes.teamRewards}>Founder rewards</h2>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <p className={classes.documentationParagraph}>
                  Because 100% of the vault funding will be contributed to the nounsdao auctions, the
                  nouns party founders have chosen to be compensated for future work in fractions of
                  the nouns which are won by the nouns party vault. They will only be compensated in
                  nouns shares and will only be compensated when an auction is won.
                </p>
                <p className={classes.documentationParagraph}>
                  The nouns DAO and the nouns party team have agreed to reward 2.5% of the noun shares
                  earned through auctions won on nouns party to the founders.
                </p>

                <p className={classes.documentationParagraph}>
                  As a result, nouns party contributors can expect 2.5% fewer tokens than their initial
                  vault contribution. For example, if a noun is won for 200E and is tokenized into
                  200,000 tokens, the vault contributors will receive 200,000 less 2.5%, or 195,000
                  tokens distributed in proportion to the amount contributed to the vault.
                </p>

                <p className={classes.documentationParagraph}>
                  This 2.5% of noun shares is distributed to the nouns party founder multisig.
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

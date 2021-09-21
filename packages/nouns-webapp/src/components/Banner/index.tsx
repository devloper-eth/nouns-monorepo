import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Container, Row, Col } from 'react-bootstrap';
import clsx from 'clsx';
import Link from '../Link';
const Banner = () => {
  const fractionalizeLink = (
    <Link text="Fractional.art" url="https://fractional.art" leavesPage={true} />
  );
  const nounsLink = <Link text="Nouns.wtf" url="https://nouns.wtf" leavesPage={true} />;

  return (
    <Section bgColor="white" fullWidth={false} className={classes.bannerSection}>
      <div className={classes.wrapper}>
        <Container fluid>
          <Row>
            <Col xs={12} md={6}>
              <h1>How It Works!</h1>
            </Col>
            <Col xs={12} md={6}>
              <Row className={classes.instructionsRow}>
                <div className={clsx(classes.instructionText)}>
                  <span>1</span>
                  <p>
                    Nouns party is the community's tool for participating in&nbsp;{nounsLink}&nbsp;auctions.
                    The nouns party vault is a rolling fund which can be used in a set it and forget style. Simply
                    contribute funds to the vault and wait.
                  </p>
                </div>
              </Row>
              <Row className={classes.instructionsRow}>
                <div className={clsx(classes.instructionText)}>
                  <span>2</span>
                  <p>
                    Over time the vault will accumulate funds. And when the vault is large enough,
                    the community will come together to use the funds
                    to bid in the daily&nbsp;{nounsLink}&nbsp; auction. If the vault is large
                    enough, the community will win a noun! If not, the funds will
                    remain in the vault for the next daily auction.
                  </p>
                </div>
              </Row>
              <Row className={classes.instructionsRow}>
                <div className={clsx(classes.instructionText)}>
                  <span>3</span>
                  <p>
                    When the community wins a noun, everyone wins. The noun will be trustlessly
                    fractionalized into nouns shares with a&nbsp;{fractionalizeLink}&nbsp;vault. These shares
                    are an ERC20 representation of the community owned noun. Contributors can return
                    and claim their shares in proportion to their contribution at any time.
                  </p>
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </Section>
  );
};

export default Banner;

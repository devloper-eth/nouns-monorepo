import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Container, Row, Col } from 'react-bootstrap';
import clsx from 'clsx';
import Link from '../Link';
const Banner = () => {
  const fractionalizeLink = (
    <Link text="Fractional.app" url="https://fractionalize.app" leavesPage={true} />
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
                    Add funds to the nouns party vault to join in with the auction. You can add as
                    little as 0.1 ETH to get the party started.
                  </p>
                </div>
              </Row>
              <Row className={classes.instructionsRow}>
                <div className={clsx(classes.instructionText)}>
                  <span>2</span>
                  <p>
                    The nouns party vault will be used to bid on the daily {nounsLink}
                    auction. If the community collects enough ethereum to outbid the largest bidder,
                    they will win a noun!
                  </p>
                </div>
              </Row>
              <Row className={classes.instructionsRow}>
                <div className={clsx(classes.instructionText)}>
                  <span>3</span>
                  <p>
                    When the community wins a noun, everyone wins. The noun will trustlessly
                    fractionalized into nouns shares with a {fractionalizeLink} vault. These shares
                    are an ERC20 representation of the community owned noun. Contributors can return
                    and claim their shares at any time.
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

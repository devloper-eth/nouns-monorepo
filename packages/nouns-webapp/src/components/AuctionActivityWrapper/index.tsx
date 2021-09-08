import { Row } from 'react-bootstrap';
import classes from './AuctionActivityWrapper.module.css';

const AuctionActivityWrapper: React.FC<{}> = props => {
  return <Row className={classes.wrapper}>{props.children}</Row>;
};
export default AuctionActivityWrapper;

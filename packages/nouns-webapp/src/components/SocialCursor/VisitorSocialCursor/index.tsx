import classes from './VisitorSocialCursor.module.css';

const VisitorSocialCursor: React.FC<{
  key: string;
  x: number;
  y: number;
  emoji: string;
  color: string;
  message: string;
}> = props => {
  const { x, y, emoji, message } = props;

  return (
    <div className={classes.cursor} style={{ left: x, top: y }}>
      <div className={classes.triangle}></div>
      <i>{emoji}</i>
      <span>{message}</span>
    </div>
  );
};

export default VisitorSocialCursor;

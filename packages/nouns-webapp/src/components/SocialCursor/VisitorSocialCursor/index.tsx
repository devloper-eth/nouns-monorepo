import { useAppSelector } from '../../../hooks';
import classes from './VisitorSocialCursor.module.css';
import { getNounSvgFile } from '../NounCursors';

const VisitorSocialCursor: React.FC<{
  key: string;
  x: number;
  y: number;
  emoji: string;
  color: string;
  message: string;
}> = props => {
  const { x, y, message, emoji } = props;

  const cursorVisibility = useAppSelector(state => state.application.cursorVisibility);

  return (
    <div
      className={classes.cursor}
      style={{ left: x, top: y, visibility: cursorVisibility ? 'visible' : 'hidden' }}
    >
      <img alt="noun cursor" src={getNounSvgFile(emoji)} className={classes.nounHeadImage} />
      {message ? <span>{message}</span> : null}
    </div>
  );
};

export default VisitorSocialCursor;

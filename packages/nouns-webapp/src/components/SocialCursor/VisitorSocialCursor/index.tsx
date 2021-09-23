import { useAppSelector } from '../../../hooks';
import classes from './VisitorSocialCursor.module.css';
import VisitorGlasses from '../../../assets/Nouns_Cursor.svg';

const VisitorSocialCursor: React.FC<{
  key: string;
  x: number;
  y: number;
  emoji: string;
  color: string;
  message: string;
}> = props => {
  const { x, y, message } = props;

  const cursorVisibility = useAppSelector(state => state.application.cursorVisibility);

  return (
    <div
      className={classes.cursor}
      style={{ left: x, top: y, visibility: cursorVisibility ? 'visible' : 'hidden' }}
    >
      <img alt="glasses cursor" src={VisitorGlasses} />
      <span>{message}</span>
    </div>
  );
};

export default VisitorSocialCursor;

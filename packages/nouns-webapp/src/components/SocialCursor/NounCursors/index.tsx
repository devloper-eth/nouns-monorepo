import blueberry from '../../../assets/noun-heads/blueberry.svg';
import clam from '../../../assets/noun-heads/clam.svg';
import clover from '../../../assets/noun-heads/clover.svg';
import fan from '../../../assets/noun-heads/fan.svg';
import lock from '../../../assets/noun-heads/lock.svg';
import maze from '../../../assets/noun-heads/maze.svg';
import mustard from '../../../assets/noun-heads/mustard.svg';
import panda from '../../../assets/noun-heads/mustard.svg';

export type NounHead = {
  name: string;
  file: string;
};

export const nounHeadCollection = [
  { name: 'blueberry', file: blueberry },
  { name: 'clam', file: clam },
  { name: 'clover', file: clover },
  { name: 'fan', file: fan },
  { name: 'lock', file: lock },
  { name: 'maze', file: maze },
  { name: 'mustard', file: mustard },
  { name: 'panda', file: panda },
];

export const randomNounHead = () => {
  return nounHeadCollection[Math.floor(Math.random() * nounHeadCollection.length)].name;
};

export const getRandomNounFeadFile = () => {
  return nounHeadCollection[Math.floor(Math.random() * nounHeadCollection.length)].file;
};

export const getNounSvgFile = (nounHead: string) => {
  let result = nounHeadCollection.filter(noun => {
    return noun.name === nounHead;
  });
  if (result && result.length) {
    return result[0].file;
  } else {
    return getRandomNounFeadFile();
  }
};

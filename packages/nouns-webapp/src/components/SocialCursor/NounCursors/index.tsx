import bank from '../../../assets/noun-heads/bank.svg';
import bat from '../../../assets/noun-heads/bat.svg';
import blueberry from '../../../assets/noun-heads/blueberry.svg';
import book from '../../../assets/noun-heads/book.svg';
import cake from '../../../assets/noun-heads/cake.svg';
import cat from '../../../assets/noun-heads/cat.svg';
import cherry from '../../../assets/noun-heads/cherry.svg';
import clam from '../../../assets/noun-heads/clam.svg';
import clover from '../../../assets/noun-heads/clover.svg';
import coin from '../../../assets/noun-heads/coin.svg';
import duck from '../../../assets/noun-heads/duck.svg';
import fan from '../../../assets/noun-heads/fan.svg';
import flamingo from '../../../assets/noun-heads/flamingo.svg';
import fluff from '../../../assets/noun-heads/fluff.svg';
import galaxy from '../../../assets/noun-heads/galaxy.svg';
import GPU from '../../../assets/noun-heads/GPU.svg';
import house from '../../../assets/noun-heads/house.svg';
import lemur from '../../../assets/noun-heads/lemur.svg';
import lock from '../../../assets/noun-heads/lock.svg';
import maze from '../../../assets/noun-heads/maze.svg';
import microwave from '../../../assets/noun-heads/microwave.svg';
import mummy from '../../../assets/noun-heads/mummy.svg';
import mustard from '../../../assets/noun-heads/mustard.svg';
import nut from '../../../assets/noun-heads/nut.svg';
import paintbrush from '../../../assets/noun-heads/paintbrush.svg';
import panda from '../../../assets/noun-heads/panda.svg';
import puffer from '../../../assets/noun-heads/puffer.svg';
import rainbow from '../../../assets/noun-heads/rainbow.svg';
import snowball from '../../../assets/noun-heads/snowball.svg';
import toaster from '../../../assets/noun-heads/toaster.svg';
import toothbrush from '../../../assets/noun-heads/toothbrush.svg';
import washer from '../../../assets/noun-heads/washer.svg';
import whale from '../../../assets/noun-heads/whale.svg';
import zombie from '../../../assets/noun-heads/zombie.svg';

export type NounHead = {
  name: string;
  file: string;
};

export const nounHeadCollection = [
  { name: 'bank', file: bank },
  { name: 'bat', file: bat },
  { name: 'blueberry', file: blueberry },
  { name: 'book', file: book },
  { name: 'cake', file: cake },
  { name: 'cat', file: cat },
  { name: 'cherry', file: cherry },
  { name: 'clam', file: clam },
  { name: 'clover', file: clover },
  { name: 'coin', file: coin },
  { name: 'duck', file: duck },
  { name: 'fan', file: fan },
  { name: 'flamingo', file: flamingo },
  { name: 'fluff', file: fluff },
  { name: 'galaxy', file: galaxy },
  { name: 'GPU', file: GPU },
  { name: 'house', file: house },
  { name: 'lemur', file: lemur },
  { name: 'lock', file: lock },
  { name: 'maze', file: maze },
  { name: 'microwave', file: microwave },
  { name: 'mummy', file: mummy },
  { name: 'mustard', file: mustard },
  { name: 'nut', file: nut },
  { name: 'paintbrush', file: paintbrush },
  { name: 'panda', file: panda },
  { name: 'puffer', file: puffer },
  { name: 'rainbow', file: rainbow },
  { name: 'snowball', file: snowball },
  { name: 'toaster', file: toaster },
  { name: 'toothbrush', file: toothbrush },
  { name: 'washer', file: washer },
  { name: 'whale', file: whale },
  { name: 'zombie', file: zombie },
];

export const randomNounHead = () => {
  return nounHeadCollection[Math.floor(Math.random() * nounHeadCollection.length)].name;
};

export const getNounSvgFile = (nounHead: string) => {
  let result = nounHeadCollection.filter(noun => {
    return noun.name === nounHead;
  });
  if (result && result.length) {
    return result[0].file;
  } else {
    return blueberry;
  }
};

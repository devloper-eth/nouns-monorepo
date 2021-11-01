import { BigNumber } from 'ethers';

interface StandalonePartyNounProps {
 partyNounId: BigNumber;
 tokenURI: String;
}

const StandalonePartyNoun: React.FC<StandalonePartyNounProps> = (props: StandalonePartyNounProps) => {
  const { partyNounId, tokenURI } = props;
  // TODO
  // return <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />;
  return <>HI there, im the image for party noun</>
};


export default StandalonePartyNoun;

import { useReverseENSLookUp } from '../../utils/ensLookup';

const ShortAddress: React.FC<{ address: string }> = props => {
  const { address } = props;

  const def = "0x00000000000000000000000000000000000000000";

  let replacement = address || def
  const ens = useReverseENSLookUp(address);
  const shortAddress = replacement && [replacement.substr(0, 4), replacement.substr(38, 4)].join('...');

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;

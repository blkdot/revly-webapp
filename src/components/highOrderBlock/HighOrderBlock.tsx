import { FabKit } from 'kits';
import './HighOrderBlock.scss';

const HighOrderBlock = (props: any) => {
  const { children, color, higher } = props;

  return (
    <div className={`high-order-block-component ${higher && '__push-top'}`}>
      <FabKit size='small' color={color || 'error'}>
        {children}
      </FabKit>
    </div>
  );
};

export default HighOrderBlock;

import {FC} from 'react'
import BranchesIcon from '../../../assets/images/ic_branch.svg';
import ArrowIcon from '../../../assets/images/arrow.svg';

const AdvertSelectBranches: FC <{
  state: any;  
}> = ({state}) => {
  console.log(state);
  return (
    <div>
      <div className='advert-branches'>
        <div>
          <span> <img src={BranchesIcon} alt='branches' /></span>
          <p>Select Branches</p>
        </div>
        <img src={ArrowIcon} alt="arrow"/>
      </div>
    </div>
  )
}

export default AdvertSelectBranches
import { MoreVert } from '@mui/icons-material';

import './PaymentMethod.scss';

const PaymentMethod = (props) => {
    const { type, cvv } = props;

    return (
        <div className="payment-method">
            <div className="payment-method__text">
                <p className="payment-method__text__type">{type}</p>
                <p className="payment-method__text__cvv">**** **** **** {cvv}</p>
            </div>
            <button type="button" className="payment-method__btn">
                <MoreVert />
            </button>
        </div>
    );
}

export default PaymentMethod;
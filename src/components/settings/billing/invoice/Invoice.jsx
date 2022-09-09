
import './Invoice.scss';

const Invoice = (props) => {
    const { date, amount } = props;

    return (
        <div className="invoice">
            <p className="invoice__date">{date}</p>
            <p>{amount}</p>
            <p className="invoice__link">PDF</p>
        </div>
    );
}

export default Invoice
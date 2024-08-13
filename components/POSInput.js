import { useState, useEffect } from 'react';
import {cardPaymentHandle, cashPaymentHandle, changeHandle, tenderedHandle} from "@/lib/slices/checkoutSlice"
import { useDispatch, useSelector } from 'react-redux';

const POSInput = ({ totalAmount }) => {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('Card Payments');
  const [nearestCashAmounts, setNearestCashAmounts] = useState([]);
  const dispatch = useDispatch();
  const { cashPayment, cardPayment} = useSelector((state)=>state.checkout)

  useEffect(() => {
    const handlePayment =  () => {
      try {
        if (activeTab === 'Cash Payment') {
           dispatch(cashPaymentHandle(parseFloat(amount || 0.00).toFixed(2)));
        } else {
           dispatch(cardPaymentHandle(parseFloat(amount || 0.00).toFixed(2)));
        }
          dispatch(changeHandle(totalAmount)) ;
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    handlePayment();
  }, [amount, dispatch, activeTab, totalAmount]);




  useEffect(() => {
    if (activeTab === 'Cash Payment') {
      const nearestAmounts = getNearestCashAmounts(totalAmount);
      setNearestCashAmounts(nearestAmounts);
    } else {
      setNearestCashAmounts([]);
    }
  }, [totalAmount, activeTab]);

  const handleButtonClick = (value, isSpecial = false) => {
    if (value === 'C') {
      setAmount('');
    } else if (value === '←') {
      setAmount(amount.slice(0, -1));
    } else if (value === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + value);
      }
    } else if (isSpecial) {
      setAmount(value);
    } else if (!isNaN(value)) {
      setAmount(prevAmount => prevAmount + value);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setAmount('');
  };

  const handleKeyPress = (e) => {
    const { key } = e;
    if (key === 'Backspace') {
      setAmount(amount.slice(0, -1));
    } else if (key === 'Enter') {
      // Handle submit or next step if needed
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + key);
      }
    } else if (!isNaN(key)) {
      setAmount(prevAmount => prevAmount + key);
    }
  };

  const getNearestCashAmounts = (total) => {
    const totalNum = parseFloat(total.replace('$', ''));
    const uniqueAmounts = new Set();
    let amount = totalNum;

    while (uniqueAmounts.size < 3) {
      amount = Math.ceil(amount + 5);
      if (String(amount) !== total) {
        uniqueAmounts.add(String(amount));
      }
    }

    return Array.from(uniqueAmounts);
  };

  const renderButtons = () => {
    const buttonConfig = [
      { value: '1' },
      { value: '2' },
      { value: '3' },
      { value: totalAmount, isSpecial: true },
      { value: '4' },
      { value: '5' },
      { value: '6' },
      { value: nearestCashAmounts[0], isSpecial: true },
      { value: '7' },
      { value: '8' },
      { value: '9' },
      { value: nearestCashAmounts[1], isSpecial: true },
      { value: '00' },
      { value: '0' },
      { value: '←' },
      { value: nearestCashAmounts[2], isSpecial: true },
      { value: '.' }
    ];

    return buttonConfig.map((button, index) => (
      <button
        key={index}
        className="py-4 bg-gray-200 text-2xl"
        onClick={() => handleButtonClick(button.value, button.isSpecial)}
      >
        {button.value}
      </button>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg" onKeyDown={handleKeyPress} tabIndex="0">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${activeTab === 'Card Payments' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => handleTabClick('Card Payments')}
        >
          Card Payments
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'Cash Payment' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => handleTabClick('Cash Payment')}
        >
          Cash Payment
        </button>
      </div>
      <div className="border p-4 text-3xl text-right mb-4">{`$${parseFloat(amount || 0.00).toFixed(2)}`}</div>
      <div className="grid grid-cols-4 gap-4">
        {renderButtons()}
        <button
          className="col-span-2 py-4 bg-gray-200 text-2xl"
          onClick={() => handleButtonClick('C')}
        >
          C
        </button>
      </div>
    </div>
  );
};

export default POSInput;

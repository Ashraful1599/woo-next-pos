// ResetButton.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleReset } from '@/lib/resetData'; // Adjust the path accordingly
import { FaArrowLeft, FaUndoAlt } from 'react-icons/fa';

const ResetButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => handleReset(dispatch)} className="reset_btn text-center">
      <FaUndoAlt />
      Reset Data
    </button>
  );
};

export default ResetButton;

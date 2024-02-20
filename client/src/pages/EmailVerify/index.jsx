import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

/* -------------------------------- MUI Icon -------------------------------- */
import {
  CheckCircleOutline
} from '@mui/icons-material';

/* -------------------------------------------------------------------------- */
/*                                 VerifyEmail                                */
/* -------------------------------------------------------------------------- */
const VerifyEmail = () => {

  /* ---------------------------------- Hooks --------------------------------- */
  const { id, token } = useParams()

  const [ verify, setVerify ] = useState("");

	/* -------------------------------- useEffect ------------------------------- */
	useEffect(() => {

    // * verifyEmailUrl
		const verifyEmailUrl = async () => {
			try {

        // * Fetch
				const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/${id}/verify/${token}`, {
					method: "GET",
				});
		
				// * Return
				const data = await response.json();
		
				// * Log
				// console.log(data);

        // * set to verify
        if(data.success) {
          setVerify(data.success);
        }        

			} catch (error) {
				console.log(error);
			}
		};

    // * Call Function
		verifyEmailUrl();

	}, [id]);

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div 
      className={`
      bg-gray-50 flex 
        items-center justify-center 
        min-w-screen min-h-screen 
        p-5
      `}
    >

      <div
        className={`
          w-full lg:max-w-3xl 
          bg-white text-gray-800 
          text-center
          p-8 lg:p-12
          shadow-xl rounded-lg
        `}
      >

        <div className="flex space-x-5 items-center ">
              
          <CheckCircleOutline 
            fontSize='large' 
            className='text-green-500'
          />

          <span className='text-start'>
            <h1 
              className={`
                text-gray-700 
                text-xl
                font-bold
              `}
            >
              Thanks for signing up for {process.env.REACT_APP_NAME}
            </h1>

            <p className='mt-1 text-sm font-bold text-gray-500'>
              { verify } <Link
                to="/login"
                className={`
                  text-blue-500 underline
                `}
              >
                here.
              </Link>
              
            </p>
          </span>

        </div>

      </div>
            
    </div>
  )
}

export default VerifyEmail;
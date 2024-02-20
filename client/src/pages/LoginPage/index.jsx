import React from 'react'

//* -------------------------------------------------------------------------- */
//*                                     MUI                                    */
//* -------------------------------------------------------------------------- */
import {
	// Box,
	// Typography,
	// useTheme,
	// useMediaQuery,
} from "@mui/material";

//* -------------------------------------------------------------------------- */
//*                                    Form                                    */
//* -------------------------------------------------------------------------- */
import Form from "./Form";

//* -------------------------------------------------------------------------- */
//*                                   Images                                   */
//* -------------------------------------------------------------------------- */
import LoginImg from './../../img/illustration/login.jpg';

//* -------------------------------------------------------------------------- */
//*                                    Hooks                                   */
//* -------------------------------------------------------------------------- */
import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                  LoginPage                                 */
//* -------------------------------------------------------------------------- */
const LoginPage = () => {

	/* -------------------------------------------------------------------------- */
	/*                                    Data                                    */
	/* -------------------------------------------------------------------------- */
	// const theme = useTheme();
	// const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    
	/* -------------------------------------------------------------------------- */
	/*                                    Hooks                                   */
	/* -------------------------------------------------------------------------- */
	const { ref , inView } = useInView();

	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<section 
			ref={ ref }
			className={`
				w-screen
				h-screen
				md:flex
				object-cover
				md:pt-20
				bg-white
				dark:bg-slate-900
			`}
		>
			{/* ---------------------------------- Left ---------------------------------- */}
			<div 
				className={`
					md:w-1/2 
					${inView ? `animate-sl-1000`: `` }
				`}
			>
				<img 
          src={ LoginImg }
          alt="banner-login"
          className='w-full mt-10'
        />
			</div>

			{/* ---------------------------------- Right --------------------------------- */}
			<div className="md:w-1/2 ">
				{/* <Box
					width={isNonMobileScreens ? "50%" : "93%"}
					p="2rem"
					m="2rem auto"
					borderRadius="1.5rem"
					// backgroundColor={theme.palette.background.alt}
				> */}
					<Form className={`mx-auto object-center justify-center`} />
				{/* </Box> */}
			</div>
			
		</section>
	)
}

export default LoginPage;
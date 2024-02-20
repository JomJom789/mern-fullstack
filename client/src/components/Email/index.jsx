import React, { useEffect, useRef, useState }  from 'react'

import emailjs from '@emailjs/browser';

import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                    Email                                   */
//* -------------------------------------------------------------------------- */
const Email = () => {
    
	/* -------------------------------------------------------------------------- */
	/*                                    Hooks                                   */
	/* -------------------------------------------------------------------------- */
	const { ref , inView } = useInView();

	/* -------------------------------------------------------------------------- */
	/*                                 Email Hooks                                */
	/* -------------------------------------------------------------------------- */
	const form = useRef();
	const [error, setError] = useState()

	/* -------------------------------------------------------------------------- */
	/*                                  sendEmail                                 */
	/* -------------------------------------------------------------------------- */
	const sendEmail = (e) => {
		e.preventDefault();

		emailjs.sendForm(
			'service_rh7uzt4', 
			'template_351bzlx', 
			form.current, 
			'JN0mXHVcwTC14XcW-'		
		)
		.then((result) => {
			console.log(result.text);
			console.log('Message Sent')
			
			if(result.text === 'OK') {
				setError('Message Sent')
			}					
		}, (error) => {
			console.log(error.text);
			setError(error.text)
		});
	};
	
	/* -------------------------------------------------------------------------- */
	/*                                  useEffect                                 */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {

	})

	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<div ref={ ref }>
			{/* Form */}
			<form 
				ref={form} 
				onSubmit={sendEmail}
				className="w-full"
			>
				{/* Title */}
				<div className=''>
					<h1 
					className={`
						sm:text-3xl
						xl:text-3xl
						font-bold
						text-slate-700 
						mt-10
						${inView ? `animate-st-600`: `` }
					`}
					>
						Send Message
					</h1>
													
					<p 
						className={`
							xx:text-sm
							md:text-lg
							font-bold
							text-slate-600
							mt-4
							mb-10
							md:mx-0
							sm:flex
							sm:flex-col
							${inView ? `animate-sr-800`: `` }
						`}
					>
						Feel free to get in touch with me for more question and inquiry.
					</p>
				</div>

				<div className='w-full mt-4'>
					<label 
						className={`
							xx:text-sm
							text-slate-600 
							font-semibold
							${inView ? `animate-sl-200`: `` }
						`}
					>
						Name
					</label>
					
					<input 
						type="text" 
						name="user_name" 
						className={`
							w-full 
							border 
							border-gray-300 
							rounded-lg 
							p-2 
							mt-2
							${inView ? `animate-sr-1000`: `` }
						`}
					/>
				</div>

				<div className='w-full mt-4'>
					<label 
						className={`
							xx:text-sm
							text-slate-600 
							font-semibold
							${inView ? `animate-st-1200`: `` }
						`}						
					>
						Email
					</label>

					<input 
						type="email"
						name="user_email"
						className={`
							w-full 
							border 
							border-gray-300 
							rounded-lg 
							p-2 
							mt-2
							${inView ? `animate-sr-1200`: `` }
						`}
					/>
				</div>

				<div className='w-full mt-4'>
					<label 
						className={`
							xx:text-sm
							text-slate-600 
							font-semibold
							${inView ? `animate-sr-1400`: `` }
						`}						
					>
						Message
					</label>

					<textarea 
						name="message"
						className={`
							w-full 
							border 
							border-gray-300 
							rounded-lg p-2 
							mt-2
							${inView ? `animate-sr-1400`: `` }
						`}
					/>
				</div>
				
				<p 
					className={`
						mt-4 
						text-xl 
						font-bold 
						text-slate-900
					`}
				> 
					{ error } 
				</p>

				<input 
					type="submit"
					value="Send"
					height="100px"
					className={`
						w-full
						text-2xl
						text-white
						font-bold
						px-6
						py-2
						
						bg-gradient-to-r
						from-blue-300
						to-cyan-300
						rounded-md
						
						mt-10
						mb-10

						hover:drop-shadow-xl
						${inView ? `animate-sr-1600`: `` }
					`}
				/>

			</form>
		</div>
	)
}

export default Email
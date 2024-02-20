import React from 'react'


import { 
	BannerNotFound,
	Contacts,
	Footer
} from '..'

//* -------------------------------------------------------------------------- */
//*                                NotFoundPage                                */
//* -------------------------------------------------------------------------- */
const NotFoundPage = () => {

	/* ---------------------------------- View ---------------------------------- */
	return (
		<div 
			className={`                
				left-0
				right-0
				bottom-0
				h-full
			`}
		>
			<BannerNotFound />
			<Contacts />
			<Footer />
		</div>
	)
}

export default NotFoundPage

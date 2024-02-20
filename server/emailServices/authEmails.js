import nodemailer from "nodemailer";
import  path from "path";
import hbs from "nodemailer-express-handlebars";


/* -------------------------------------------------------------------------- */
/*                                Verify Emails                               */
/* -------------------------------------------------------------------------- */
export const verifyEmails = async (firstName, lastName, email, subject, text, url) => {
	try {

		// * Log
		// console.log(firstName);
		// console.log(lastName);
		// console.log(email);
		// console.log(subject);
		// console.log(text);
		// console.log(url);
		
		// * Year
		const todaysDate = new Date()
		const currentYear = todaysDate.getFullYear()

		// * transporter
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		// * handlebarOptions
		const handlebarOptions = {
			viewEngine: {
				extName: ".handlebars",
				partialsDir: path.resolve('./views'),
				defaultLayout: false,
			},
			viewPath: path.resolve('./views'),
			extName: ".handlebars",
		}
		
		transporter.use('compile', hbs(handlebarOptions));

		// * mailOptions
		var mailOptions = {
			from: process.env.USER,
			to: email,
			subject: subject,
			template: 'email',
			context: {
				host: process.env.BASE_URL,
				firstName: firstName,
				lastName: lastName,
				subject: subject,
				text: text,
				url: url,
				year: currentYear,
			},
			attachments: [
				{
        	filename: 'Img1_2x.jpg',
        	path: 'views/images/Img1_2x.jpg',
        	cid: 'email-logo'
    		},
				{
        	filename: 'footer.png',
        	path: 'views/images/footer.png',
        	cid: 'footer'
    		},
				{
        	filename: 'facebook2x.png',
        	path: 'views/images/facebook2x.png',
        	cid: 'facebook-icon'
    		},
				{
        	filename: 'twitter2x.png',
        	path: 'views/images/twitter2x.png',
        	cid: 'twitter-icon'
    		},
				{
        	filename: 'instagram2x.png',
        	path: 'views/images/instagram2x.png',
        	cid: 'instagram-icon'
    		},
				{
        	filename: 'linkedin2x.png',
        	path: 'views/images/linkedin2x.png',
        	cid: 'linkedin-icon'
    		},
			],
		};

		// * SendMail: Nodemailer
		// await transporter.sendMail({
		// 	from: process.env.USER,
		// 	to: email,
		// 	subject: subject,
		// 	text: text,
		// });

		// * SendMail: Nodemailer Handlebars
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});

		// * Log
		console.log("Email Sent Successfully");

	} catch (error) {

		console.log("Email Not Sent!");
		console.log(error);
		return error;

	}
};

/* -------------------------------------------------------------------------- */
/*                               Forgot Password                              */
/* -------------------------------------------------------------------------- */
export const forgotPasswordEmail = async (firstName, lastName, email, subject, text, url) => {
	try {

		// * Log
		// console.log(firstName);
		// console.log(lastName);
		// console.log(email);
		// console.log(subject);
		// console.log(text);
		// console.log(url);
		
		// * Year
		const todaysDate = new Date()
		const currentYear = todaysDate.getFullYear()

		// * transporter
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		// * handlebarOptions
		const handlebarOptions = {
			viewEngine: {
				extName: ".handlebars",
				partialsDir: path.resolve('./views'),
				defaultLayout: false,
			},
			viewPath: path.resolve('./views'),
			extName: ".handlebars",
		}
		
		transporter.use('compile', hbs(handlebarOptions));

		// * mailOptions
		var mailOptions = {
			from: process.env.USER,
			to: email,
			subject: subject,
			template: 'reset-password',
			context: {
				host: process.env.BASE_URL,
				firstName: firstName,
				lastName: lastName,
				subject: subject,
				text: text,
				url: url,
				year: currentYear,
			},
			attachments: [
				{
        	filename: 'Img22x.jpg',
        	path: 'views/images/Img22x.jpg',
        	cid: 'forgot-password-logo'
    		},
				{
        	filename: 'footer.png',
        	path: 'views/images/footer.png',
        	cid: 'footer'
    		},
				{
        	filename: 'facebook2x.png',
        	path: 'views/images/facebook2x.png',
        	cid: 'facebook-icon'
    		},
				{
        	filename: 'twitter2x.png',
        	path: 'views/images/twitter2x.png',
        	cid: 'twitter-icon'
    		},
				{
        	filename: 'instagram2x.png',
        	path: 'views/images/instagram2x.png',
        	cid: 'instagram-icon'
    		},
				{
        	filename: 'linkedin2x.png',
        	path: 'views/images/linkedin2x.png',
        	cid: 'linkedin-icon'
    		},
			],
		};

		// * SendMail: Nodemailer
		// await transporter.sendMail({
		// 	from: process.env.USER,
		// 	to: email,
		// 	subject: subject,
		// 	text: text,
		// });

		// * SendMail: Nodemailer Handlebars
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent Successfully: ' + info.response);				
			}
		});

	} catch (error) {
		console.log("Email Not Sent!");
		console.log(error);
		return error;
	}
};
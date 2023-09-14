import setEnv from '@americanairlines/simple-env';
import * as dotenv from 'dotenv';
dotenv.config();

export const env = setEnv({
	required: {},
	optional: {
		nodeEnv: 'NODE_ENV',
		websiteUrl: 'WEBSITE_URL',
	},
});


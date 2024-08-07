import moment from 'moment';

// export const determineDateToShow = (createdAt: Date, updatedAt: Date) => (moment(createdAt).isBefore(updatedAt) ? `Edited ${moment(updatedAt).format('LLL')}` : `Submitted ${moment(createdAt).format('LLL')}`);
export const determineDateToShow = (createdAt: Date, updatedAt: Date) => (moment(moment(createdAt).isBefore(updatedAt) ? updatedAt : createdAt).fromNow());

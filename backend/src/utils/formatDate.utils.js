export const formatDate = (dueDate) => {
    if (!dueDate) {
        return null;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); 

    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD.');
    }
    date.setUTCHours(0, 0, 0, 0); 

    if (date < today) {
        throw new Error('Due date cannot be in the past.');
    }

    date.setUTCHours(23, 59, 59, 999);

    return date;
};

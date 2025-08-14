import prisma from "../prisma.js";

const savelistSelect = {
    id: true,
    name: true,
    userId: true,
    groupId: true,
    createdAt: true,
    updatedAt: true,
};

/**
 * @param {string} userId
 * @returns {Promise<Object|null>} 
 * 
 */
async function createList(name, userId, groupId) {
    
        if (!name) {
            throw new Error('List name is required');
        }
    try {
        const newList = await prisma.list.create({
            data: {
                name,
                userId,
                ...(groupId ? { groupId } : {}),
            },
            select: savelistSelect,
        });
        return newList;
    } catch (error) {
        console.error('Error creating list:', error);
        throw new Error('Could not create list');
    }
};


/**
 * @param {string} userId
 * @returns {Promise<Array<object>>} 
 */
async function getUserLists(userId) {
    try {
        const lists = await prisma.list.findMany({
            where: { userId },
        });
        return lists;
    } catch (error) {
        console.error('Error fetching user lists:', error);
        throw new Error('Could not fetch user lists');
    }
};


/**
 * @param {string} listId
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function getListById(listId, userId) {
    try {
        const list = await prisma.list.findUnique({
            where: { 
                id: listId,
                userId: userId
            },
            select: savelistSelect,
        });
        return list;
    } catch (error) {
        console.error('Error fetching list by ID:', error);
        throw new Error('Could not fetch list');
    }
}


/** * 
 * @param {string} listId
 * @param {string} name
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function updateListName(listId, name, userId) {
    

        if (!name) {
            throw new Error('List name is required');
        }
        
        const existingList = await prisma.list.findUnique({
            where: { id: listId, userId },
        });
        
        if (!existingList) {
            throw new Error('List not found or does not belong to the user');
        }
    try {
        const updatedList = await prisma.list.update({
            where: { id: listId },
            data: { name },
            select: savelistSelect,
        });
        return updatedList;
    } catch (error) {
        console.error('Error updating list name:', error);
        throw new Error('Could not update list name');
    }
}

/** * 
 * @param {string} listId
 * @param {string} groupId
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function addToGroup(listId, groupId, userId) {
    
        const existingList = await prisma.list.findUnique({
            where: {
                id: listId,
                userId: userId
            }
        });

        if (!existingList) {
            throw new Error('List not found or does not belong to the user');
        }
        
        const existingGroup = await prisma.group.findUnique({
            where: {
                id: groupId,
                userId: userId
            }
        });
        
        if (!existingGroup) {
            throw new Error('Group not found or does not belong to the user');
        }

    try {
        const updatedList = await prisma.list.update({
            where: { id: listId },
            data: { groupId },
            select: savelistSelect,
        });
        return updatedList;
    } catch (error) {
        console.error('Error updating list group:', error);
        throw new Error('Could not update list group');
    }
}

/**
 * @param {string} listId
 * @param {string} userId
 * @returns {Promise<Object||null>}
 */

async function removeFromGroup(listId, userId){
    
        const existingList = await prisma.list.findUnique({
            where: {
                id: listId,
                userId: userId
            }
        });

        if(!existingList) {
            throw new Error('List not found')
        }
    try{
        const updateList = await prisma.list.update({
            where: { id: listId },
            data: { groupId: null },
            select: savelistSelect
        });

        return updateList;
    } catch(error) {
        throw new Error('Could not remove list from group');
    }
};


/**
 * @param {string} listId
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function deleteList(listId, userId) {
    
        const existingList = await prisma.list.findUnique({
            where: {
                id: listId,
                userId: userId
            }
        });
        
        if (!existingList) {
            throw new Error('List not found or does not belong to the user');
        }
    try {
        const deletedList = await prisma.list.delete({
            where: { id: listId },
            select: savelistSelect,
        });
        return deletedList;
    } catch (error) {
        console.error('Error deleting list:', error);
        throw new Error('Could not delete list');
    }
}

export default {
    createList,
    getUserLists,
    addToGroup,
    getListById,
    updateListName,
    removeFromGroup,
    deleteList,
};
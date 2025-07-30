import prisma from '../prisma.js';

const groupSelect = {
    id: true,
    name: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
};

/**
 *  
 * @param {string} userId
 * @returns {Promise<Object|null>} 
 */
async function createGroup({ name, userId }) {
    try {
        if(!name){
            throw new Error('Group name is required');
        }

        const newGroup = await prisma.group.create({
            data: {
                name,
                userId,
            },
            select: groupSelect,
        });

        return newGroup;
    } catch (error) {
        console.error('Error creating group:', error);
        throw new Error('Failed to create group');
    }
};


/**
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
async function getUserGroups(userId) {
    try {
        const groups = await prisma.group.findMany({
            where: { userId },
            select: groupSelect,
        });
        return groups;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw new Error('Failed to fetch user groups');
    }
};

/**
 * @param {string} groupId
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function getGroupById(groupId, userId) {
    try {
        const group = await prisma.group.findUnique({
            where: { 
                id: groupId,
                userId: userId
            },
            select: groupSelect,
        });
        return group;
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        throw new Error('Failed to fetch group');
    }
};


/**
 * @param {string} groupId
 * @param {string} name
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function updateGroupName(groupId, name, userId) {
    try {
        if (!name) {
            throw new Error('Group name is required');
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

        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: { name },
            select: groupSelect,
        });
        return updatedGroup;
    } catch (error) {
        console.error('Error updating group name:', error);
        throw new Error('Failed to update group name');
    }
};

/**
 * @param {string} groupId
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */

async function deleteGroup(groupId, userId) {
    try {
        const existingGroup = await prisma.group.findUnique({
            where: {
                id: groupId,
                userId: userId
            }
        });
        
        if (!existingGroup) {
            throw new Error('Group not found or does not belong to the user');
        }
        
        const deletedGroup = await prisma.group.delete({
            where: { id: groupId },
            select: groupSelect,
        });
        return deletedGroup;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw new Error('Failed to delete group');
    }
};


export default {
    createGroup,
    getUserGroups,
    getGroupById,
    updateGroupName,
    deleteGroup,
}
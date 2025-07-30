import groupService from "../services/group.services.js";

async function createGroup(req, res) {
    const { name } = req.body;
    const userId = req.user.id;
    if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
    }

    try{
        const newGroup = await groupService.createGroup({ name, userId });
        res.status(201).json(newGroup);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

async function getUserGroups(req, res) {
    const userId = req.user.id; 

    try {
        const groups = await groupService.getUserGroups(userId);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


async function getGroupById(req, res) {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const group = await groupService.getGroupById(groupId, userId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function updateGroupName(req, res) {
    const { groupId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
    }

    try {
        const updatedGroup = await groupService.updateGroupName(groupId, name, userId);
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function deleteGroup(req, res) {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const deletedGroup = await groupService.deleteGroup(groupId, userId);
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createGroup,
    getUserGroups,
    getGroupById,
    updateGroupName,
    deleteGroup
};
import listServices from "../services/list.services.js";

async function createList(req, res) {
    const { name, groupId } = req.body;
    const userId = req.user.id;
    if (!name) {
        return res.status(400).json({ message: 'List name is required' });
    }

    try {
        const newList = await listServices.createList(name, userId, groupId);
        res.status(201).json(newList);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

async function getUserLists(req, res) {
    const userId = req.user.id; 

    try {
        const lists = await listServices.getUserLists(userId);
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getListById(req, res) {
    const { listId } = req.params;
    const userId = req.user.id;

    try {
        const list = await listServices.getListById(listId, userId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function updateList(req, res) {
    const { listId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'List name is required' });
    }

    try {
        const updatedList = await listServices.updateListName(listId, name, userId);
        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json(updatedList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function addToGroup(req, res) {
    const { listId } = req.params;
    const { groupId } = req.body;
    const userId = req.user.id;
    
    if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required' });
    }
    try {
        const updatedList = await listServices.addToGroup(listId, groupId, userId);
        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json(updatedList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function deleteList(req, res) {
    const { listId } = req.params;
    const userId = req.user.id;

    try {
        const deletedList = await listServices.deleteList(listId, userId);
        if (!deletedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createList,
    getUserLists,
    getListById,
    updateList,
    addToGroup,
    deleteList
};

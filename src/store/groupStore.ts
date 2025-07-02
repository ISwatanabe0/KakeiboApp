import { create } from 'zustand';
import { Group } from '../types';
import { getAllGroups, addGroup as dbAddGroup, deleteGroup as dbDeleteGroup } from '../db/db';

interface GroupState {
  groups: Group[];
  fetchGroups: () => Promise<void>;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Promise<void>;
  deleteGroup: (groupId: number) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  fetchGroups: async () => {
    const groups = await getAllGroups();
    set({ groups });
  },
  addGroup: async (group) => {
    await dbAddGroup(group);
    await get().fetchGroups();
  },
  deleteGroup: async (groupId) => {
    await dbDeleteGroup(groupId);
    await get().fetchGroups();
  },
}));

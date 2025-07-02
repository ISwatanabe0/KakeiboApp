import { create } from 'zustand';
import { Group } from '../types';

interface GroupState {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (groupId: number) => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  updateGroup: (group) => set((state) => ({
    groups: state.groups.map((g) => (g.id === group.id ? group : g)),
  })),
  removeGroup: (groupId) => set((state) => ({
    groups: state.groups.filter((g) => g.id !== groupId),
  })),
}));

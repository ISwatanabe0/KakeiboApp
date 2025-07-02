import { create } from 'zustand';
import { Member } from '../types';

interface MemberState {
  members: Member[];
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (member: Member) => void;
  removeMember: (memberId: number) => void;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  setMembers: (members) => set({ members }),
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  updateMember: (member) => set((state) => ({
    members: state.members.map((m) => (m.id === member.id ? member : m)),
  })),
  removeMember: (memberId) => set((state) => ({
    members: state.members.filter((m) => m.id !== memberId),
  })),
}));

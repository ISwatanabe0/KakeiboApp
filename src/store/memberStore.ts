import { useState } from 'react';
import { getAllMembers, addMember, updateMember, deleteMember } from '../db/db';
import type { Member } from '../types/member';

export function useMemberStore() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  // メンバー一覧を取得
  const fetchMembers = async () => {
    setLoading(true);
    const data = await getAllMembers();
    setMembers(data);
    setLoading(false);
  };

  // メンバーを追加
  const add = async (member: Omit<Member, 'id' | 'createdAt'>) => {
    await addMember(member);
    await fetchMembers();
  };

  // メンバーを編集
  const update = async (member: Member) => {
    await updateMember(member);
    await fetchMembers();
  };

  // メンバーを削除
  const remove = async (id: number) => {
    await deleteMember(id);
    await fetchMembers();
  };

  return {
    members,
    loading,
    fetchMembers,
    add,
    update,
    remove,
  };
}

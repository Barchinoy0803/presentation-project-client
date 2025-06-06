import type { User } from '../../types';

interface UserListProps {
  users: User[];
  currentUserId: string;
  onChangeRole: (userId: string, newRole: 'EDITOR' | 'VIEWER') => void;
  isCreator: boolean;
}

export default function UserList({ users, currentUserId, onChangeRole, isCreator }: UserListProps) {
  return (
    <div className="w-48 bg-gray-100 border-l border-gray-300 p-2 flex flex-col">
      <h2 className="font-semibold mb-2">Users</h2>
      <div className="flex-grow overflow-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-2 rounded mb-1 ${
              user.id === currentUserId ? 'bg-green-300 font-bold' : ''
            }`}
          >
            {user.nickname} ({user.role})
            {isCreator && user.id !== currentUserId && (
              <select
                value={user.role}
                onChange={(e) => onChangeRole(user.id!, e.target.value as 'EDITOR' | 'VIEWER')}
                className="ml-2 border border-gray-300 rounded"
              >
                <option value='VIEWER'>Viewer</option>
                <option value='EDITOR'>Editor</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

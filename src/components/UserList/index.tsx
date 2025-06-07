import type { User } from '../../types';

interface UserListProps {
  users: User[];
  currentUserId: string;
  onChangeRole: (userId: string, newRole: 'EDITOR' | 'VIEWER') => void;
  isCreator: boolean;
  className?: string;
}

export default function UserList({ users, currentUserId, onChangeRole, isCreator, className = '' }: UserListProps) {
  return (
    <div className={`${className} flex flex-col border-l border-gray-200 bg-white`}>
      <h2 className="font-semibold p-3 border-b border-gray-200">Users</h2>
      <div className="flex-grow overflow-auto p-3 space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 rounded-lg flex justify-between items-center ${
              user.id === currentUserId ? 'bg-indigo-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                user.role === 'CREATOR' ? 'bg-green-500' : 
                user.role === 'EDITOR' ? 'bg-blue-500' : 'bg-gray-400'
              }`}></div>
              <span className="font-medium">{user.nickname}</span>
            </div>
            {isCreator && user.id !== currentUserId && (
              <select
                value={user.role}
                onChange={(e) => onChangeRole(user.id!, e.target.value as 'EDITOR' | 'VIEWER')}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="VIEWER">Viewer</option>
                <option value="EDITOR">Editor</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
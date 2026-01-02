import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img
              src={avatarUrl}
              alt={`${user.username}'s avatar`}
              className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {user.username}!
          </h1>

          {user.discriminator !== '0' && (
            <p className="text-gray-600 mb-1">
              #{user.discriminator}
            </p>
          )}

          {user.email && (
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
          )}

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">User ID</p>
            <p className="text-gray-800 font-mono text-xs break-all">
              {user.id}
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

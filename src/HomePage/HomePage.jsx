function HomePage({ user }) {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
      {user ? (
        <h2 className="text-2xl">Chào mừng, {user}!</h2>
      ) : (
        <p className="text-gray-600">Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
}

export default HomePage;

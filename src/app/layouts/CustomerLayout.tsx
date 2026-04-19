import { Outlet } from 'react-router';

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-[390px] mx-auto bg-white min-h-screen shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}

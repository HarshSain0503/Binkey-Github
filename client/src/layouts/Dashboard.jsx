import { Outlet } from "react-router-dom"
import UserMenu from "../component/Usermenu"
import { useSelector } from "react-redux"

const Dashboard = () => {
  const user= useSelector(state => state.user)


  return (
    <section className="bg-white">
      <div className="container mx-auto grid lg:grid-cols-[250px,1fr]">
        {/* left for menu */}
        <div className="py-10 px-auto mr-6 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block ">
          <UserMenu />
        </div>

        {/* right for content */}
        <div className="bg-white p-3 min-h-[77vh] px-5 border-l-2">
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default Dashboard

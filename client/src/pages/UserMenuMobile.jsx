import UserMenu from "../component/Usermenu"
import { RiCloseLine } from "react-icons/ri";

const UserMenuMobile = () => {
    return (
        <section className="bg-white h-full w-full py-5">
            <button onClick={() => window.history.back()} className="text-neutral-800 block w-fit ml-auto">
                <RiCloseLine size={25} />
            </button>
            <div className="container mx-auto p-3 pb-8">
                <UserMenu />
            </div>
        </section>
    )
}

export default UserMenuMobile

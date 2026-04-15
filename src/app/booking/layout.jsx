import Footer from "@/components/globals/Footer"
import Navbar from "@/components/globals/Navbar"


const layout = ({ children }) => {
    return (
        <div>

            <Navbar />
            {children}
            <Footer /></div>
    )
}

export default layout
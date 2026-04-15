import Footer from "@/components/globals/Footer"
import Navbar from "@/components/globals/Navbar"
import { Suspense } from "react"


const layout = ({ children }) => {
    return (
        <Suspense>
            <Navbar />
            {children}
            <Footer />
        </Suspense>
    )
}

export default layout
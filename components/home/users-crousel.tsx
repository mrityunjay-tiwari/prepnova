import { Highlighter } from "../ui/highlighter";
import { FeatureShowcase } from "./feature-showcase";
import Headings from "./headings";
import { WhoItIsForSection } from "./who-it-is-for";

export default function UsersCarousel() {
    return (
        <div className="w-full mx-auto max-w-5xl mt-16">
            <div className="flex justify-self-center font-light">
                <Highlighter action="underline" color="#FF9800">
                    For you if you are preparing for :
                </Highlighter> 
            </div>
            <WhoItIsForSection />
        </div>
    )
}
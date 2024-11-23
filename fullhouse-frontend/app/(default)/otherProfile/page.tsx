import { Biohazard, Heading3 } from "lucide-react";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OtherProfile() {
    // Replace these constants with data from backend
    const otherPerson = "Rahsun Komatsuzaki-Fields";
    const bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    const location = "Cambridge MA"
    const phone = "555-123-4567"
    const email = "rahsunk@mit.edu"
    const preferences = {
        status: "Not looking for housing",
        gender: "Male",
        year: "Senior Undergraduate",
        sleepTime: "Between 9:00 PM and 11:00 PM",
        wakeTime: "Before 7:00 AM",
        cleanliness: "Mess/clutter does not bother me",
        temperature: "I prefer a relatively cool temperature (below 68F/20C)",
        guestPolicy: "Spontaneity is great! Anything (within reason) is fine by me.",
        sleepLightLevel: "No preference",
    }

    function mockUser(){
        return <div className="p-10 bg-white rounded-lg shadow-md">
            <div className="flex justify-around space-x-5 m-3">
                <Image
                src="/kirbyPop.jpg"
                alt="Profile Picture"
                width={128}
                height={128}
                />
                <h1 className="text-4xl font-bold mb-2">{otherPerson}</h1>
            </div>
            <div className="m-5 my-3">
                <p>Staying at {location} this summer.</p>
                <Button variant="default" className="my-3">
                    View Profile
                </Button>
            </div>
        </div>
    }


    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col justify-between m-10">
                <div className="p-20 py-5 bg-white rounded-lg shadow-md">
                    <div className="flex justify-around m-5 space-x-10">
                            {/* Replace this temporary image with profile picture of the user (from backend) */}
                        <Image
                        src="/kirbyPop.jpg"
                        alt="Profile Picture"
                        width={128}
                        height={128}
                        />
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Hi! I'm {otherPerson}</h1>
                            <p className="">{bio}</p>
                        </div>
                    </div>
                    <div className="m-5">
                        <p>I am staying at {location} this summer.</p>
                        <p>Phone: {phone}</p>
                        <p>Email: {email}</p>
                        <Button variant="default" className="my-3">
                        {/* <Button variant="default" className="my-3" onClick={() => router.push("/messages")}> */}
                            Message
                        </Button>
                        <h2>
                            <h2 className="text-2xl font-bold mb-2">Preferences:</h2>
                            {Object.entries(preferences).map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key.charAt(0).toUpperCase()+key.slice(1).replace(/([A-Z])/g, " $1")}: </strong>
                                    {value}
                                </li>
                                ))}
                        </h2>
                    </div>
                </div>
                <div className="my-5">
                    <h2 className="text-2xl font-bold mb-2 my-5">Other people in the same area:</h2>
                    {/* Replce using components and a list of people; for now I have four duplicate users as an example*/}
                    <div className="flex flex-row grid grid-cols-3 gap-4">
                        {mockUser()}
                        {mockUser()}
                        {mockUser()}
                        {mockUser()}
                    </div>
                </div>
            </div>
        </div>
    )
}

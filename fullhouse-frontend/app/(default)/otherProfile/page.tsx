import { Biohazard } from "lucide-react";
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function OtherProfile() {
    // Replace these constants with data from backend
    const otherPerson = "Rahsun Komatsuzaki-Fields";
    const bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    const location = "Cambridge MA"
    const phone = "555-123-4567"
    const email = "rahsunk@mit.edu"

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col justify-between m-10">
                <div className="p-20 bg-white rounded-lg shadow-md">
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
                            Message
                        </Button>
                    </div>
                </div>
                <div className="my-5">
                    <h1 className="my-5">Other people in the same area:</h1>
                    {/* Replce using components and a list of people; for now I have four duplicate users as an example*/}
                    <div className="flex flex-row grid grid-cols-3 gap-4">
                        <div className="p-10 bg-white rounded-lg shadow-md">
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
                        <div className="p-10 bg-white rounded-lg shadow-md">
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
                        <div className="p-10 bg-white rounded-lg shadow-md">
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
                        <div className="p-10 bg-white rounded-lg shadow-md">
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
                    </div>
                </div>
            </div>
        </div>
    )
}
